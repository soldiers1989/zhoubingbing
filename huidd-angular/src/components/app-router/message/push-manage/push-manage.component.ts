/* 推送消息 */
import { Component, Optional, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/services/http-service';
import { MyService } from 'src/services/my-service';
import { regex } from 'src/services/regex';

@Component({
    templateUrl: './push-manage.html'
})

export class PushManageComponent implements OnInit {
    // 复选框
    @ViewChild('checkboxAll') checkboxAll;
    constructor(
        private router: Router,
        @Optional() private http: HttpService,
        @Optional() private myService: MyService
    ) {
        this.form.key1 = '';
        this.form.key3 = '';
        myService.getSelectList(this, 'selectList', 'key6', '/api/url');
    }

    public tip = {};
    public selectList = <any>{};

    // 表单数据
    public regex = regex;
    public form = <any>{};
    public payload = {
        example: <any>{},
        page: null,
        size: null,
    };

    // 表格数据
    public items = [];
    public table = {
        th: [
            { key: 'key', text: 'ID', width: '12%' },
            { key: 'key', text: '类型', width: '12%' },
            { key: 'key', text: '标题类容', width: '16%' },
            { key: 'key', text: '时间', width: '16%' },
            { key: 'key', text: '操作者', width: '12%' }
        ]
    };
    // 设置存储缓存的键
    public formStorageKey: string = 'messagePushManageForm';

    // 初始化分页参数
    @ViewChild('appPagination') public appPagination;
    public paginationData: any = {
        target: this
    }

    // 查询
    public queryStatus = false;
    public search = this.myService.search;
    public searchCallback() {
        this.items = [{ key: 'test', id: '123' }];
        return;
        this['queryStatus'] = true;
        this.http.post('/api/url', this.payload).subscribe(
            response => {
                this.queryStatus = false;
                if (response['code'] !== '000000') return;
                this.items = response['data'];
                this.paginationData = {
                    totalItems: response['total'],
                    currentPage: this.payload['page']
                };

                // 初始化复选框
                this.checkboxAll['init'](this.items);
            },
            error => { this.queryStatus = false; }
        )
    }

    // 添加分类
    public addItem() {
        this.router.navigate(['app/message/push-manage/add']);
    }

    // 批量删除
    public delItems() {
        var payload = {
            vBoxes: this.checkboxAll['getData']('corporation')
        };
        if (payload.vBoxes.length == 0) {
            alert('请选择要删除的数据！');
            return;
        }

        ; (window as any).confirm({
            text: '您确认要删除当前选择的信息吗？',
            done: (data) => {
                this.http.post('/api/user/v1/updateStatus', payload).subscribe(
                    response => {
                        if (response['code'] !== '000000') return;
                        this.search();
                        alert('删除信息成功');
                    },
                    error => { }
                )
            }
        })
    }

    // 重置表单 -----------------------------------------------------------------------
    public reset() {
        this.form = {};
        this.form.key1 = '';
        this.form.key3 = '';
    }

    ngOnInit() {
        this.myService.setPayload(this);
        this.search(true);
    }
}
