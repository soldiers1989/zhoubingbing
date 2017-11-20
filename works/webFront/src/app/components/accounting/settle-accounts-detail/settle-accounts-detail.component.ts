import { Component, OnInit, ViewChild, Optional } from '@angular/core';
import { DatePipe } from '@angular/common';

import { HttpService } from '@service/http-service';
import { MyService } from '@service/my-service';
import { regex } from '@service/regex';
import { env } from '@service/environment';

@Component({
    templateUrl: './settle-accounts-detail.html',
    providers: [
        HttpService,
        DatePipe
    ]
})
export class SettleAccountsDetailComponent {
    // 表单
    public form = {};
    public postForm = {};
    public regex = regex;

    // 数据 list
    public items = [];

    // 设置 存储缓存的键
    public formStorageKey: string = 'settleAccountsDetailForm';
    public tableLocalKey: string = 'settleAccountsDetailTable';

    // 配置表格
    public table = {
        th: [
            { key: 'liqDate', text: '结算日期', require: true },
            { key: 'mercId', text: '商户号', require: true },
            { key: 'mercName', text: '商户名称', require: false },
            { key: 'termId', text: '终端号', require: true },
            { key: 'siteName', text: '网点名称', require: false },
            { key: 'settlePeriod', text: '结算周期', require: true },
            { key: 'srefNo', text: '系统参考号', require: false },
            { key: 'tranDate', text: '交易日期', require: true },
            { key: 'tranTime', text: '交易时间', require: true },
            { key: 'tranAmount', text: '交易金额', require: true },
            { key: 'fee', text: '手续费', require: true },
            { key: 'liqAmount', text: '结算金额', require: true },
            { key: 'tranType', text: '交易类型', require: false },
            { key: 'payType', text: '支付渠道', require: false },
            { key: 'cardNo', text: '卡号', require: false },
            { key: 'clearDate', text: '清算日期', require: false }
        ],
        storage: []
    };

    constructor(
        private http: HttpService,
        @Optional() private myService: MyService,
        private datePipe: DatePipe
    ) {
        // 表单缓存
        let formStorage = myService.getStorage('session', this.formStorageKey);
        this.form = formStorage ? formStorage : this.form;

        // 表格缓存
        let tableSession = myService.getStorage('local', this.tableLocalKey);
        this.table.storage = tableSession ? tableSession : this.table.th;
    }

    // 初始化 分页参数
    @ViewChild('appPagination') public appPagination;
    public stopSearch = false;
    public paginationData: any = {
        pageChanged: ($event) => {
            // 阻止查询两次
            if (this.stopSearch) {
                this.stopSearch = false;
                return;
            }
            // 查询
            this.search(null, $event.page, $event.itemsPerPage);
        }
    }

    // 查询时间
    public timeStart = 'liqStartDate';
    public timeEnd = 'liqEndDate';

    // 查询
    public search(e?, page?: number, size: number = env['itemsPerPage']) {
        // 回归第一页
        if (e) page = 1;
        if (!page && this.postForm['page']) {
            // 用于 手动执行search方法， 保留当前页（删除数据， 新增）
            page = this.postForm['page'];
        } else if (!page) {
            // 默认查询
            page = 1;
        }

        // 设置分页
        this.postForm['page'] = page;
        this.postForm['size'] = size;
        // 如果是由查询按钮触发的更新缓存 和 提交对象
        if (e && e !== true) {
            this.postForm = Object.assign({}, this.form);

            /* 如果查询条件有时间 需要特殊处理 */
            let f = this.myService.formatTime(this);
            if (!f) return;

            this.myService.setStorage('session', this.formStorageKey, this.form);

            // 重置下载 查询符
            this.setTableSearch(this.table.storage);
        }

        // 阻止查询两次
        if (e && this.appPagination['data']['currentPage'] > 1) {
            this.stopSearch = true;
        }

        window['loading']['open']();
        this.http.post('api/v1/settlement/querySettlementDetail', this.postForm).subscribe(
            response => {
                window['loading']['close']();
                if (response['retCode'] === '000000') {
                    this.items = response['data']
                    this.paginationData = {
                        totalItems: response['total'],
                        currentPage: e ? 1 : 0
                    };
                } else {
                    alert(response['retMsg']);
                }
            },
            error => {
                window['loading']['close']();
                alert("网络错误，请求数据失败");
            }
        )

        // 汇总
        this.searchCount();
    }
    // 汇总查询
    public phCount = {};
    public searchCount() {
        let data = Object.assign({}, this.postForm);
        data['queryAggs'] = 'aggs';
        this.http.post('api/v1/settlement/querySettlementDetailSum', data).subscribe(
            response => {
                if (response['retCode'] === '000000') {
                    this.phCount = response['data'];
                } else {
                    alert(response['retMsg']);
                }
            },
            error => {
                alert("网络错误，请求数据失败");
            }
        )
    }

    // 商户号选择
    @ViewChild('listMerchant') listMerchant: ViewChild;

    // 重置表单 -----------------------------------------------------------------------
    // @ViewChild('searchForm') public searchForm;
    public reset() {
        this.myService.removeStorage('session', this.formStorageKey);
        // this.searchForm.resetForm();

        // 初始化表单
        this.form = {};
        let date = new Date();
        this.form['liqStartDate'] = date;
        this.form['liqEndDate'] = date;

        // 清空商户号 选择
        this.listMerchant['rest']();
    }

    // 表头定制-----------------------------------------------------------------------
    @ViewChild('appModalCustom') public appModalCustom;
    @ViewChild('tableCustom') public tableCustom;

    public tableCustomStart() {
        this.tableCustom.modalInit()
        this.appModalCustom.showModal();
    }
    public tableDone(data) {
        this.myService.setStorage('local', this.tableLocalKey, data);
        this.table.storage = data;

        // 重置下载查询符
        this.setTableSearch(data);
    }

    // 下载表格-----------------------------------------------------------------------
    public tableSearch: string;
    public setTableSearch(data) {
        this.myService.tableSearch(this, data);
    }

    ngOnInit() {
        // 查询 数据 - 如果有查询条件
        let formStorage = this.myService.getStorage('session', this.formStorageKey);

        if (formStorage) {
            let start = formStorage[this.timeStart];
            let end = formStorage[this.timeEnd];

            this.postForm = formStorage;
            if (start) {
                this.postForm[this.timeStart] = this.datePipe.transform(start, env['format']);
            }
            if (end) {
                this.postForm[this.timeEnd] = this.datePipe.transform(end, env['format']);
            }
        } else {
            let date = new Date();
            // 初始化表单
            this.form[this.timeStart] = date;
            this.form[this.timeEnd] = date;

            this.postForm[this.timeStart] = this.datePipe.transform(date, env['format']);
            this.postForm[this.timeEnd] = this.datePipe.transform(date, env['format']);
        }
        this.search();

        // 设置下载 查询符
        this.setTableSearch(this.table.storage);
    }
}