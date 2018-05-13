package com.example.springboot.config;

import static org.junit.Assert.assertEquals;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

import com.example.springboot.util.SpringUtil;

@Configuration
public class SpringConfig  {
	@Autowired
	public BookProperties bookProperties;
	
	@Bean
	public BookProperties handler() {
		System.out.println(this.bookProperties.getId());
		BookProperties book = new BookProperties();
		return book;
	}
	
}
