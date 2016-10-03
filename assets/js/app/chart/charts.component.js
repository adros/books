"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var error_handler_1 = require('../error-handler');
var hero_service_1 = require('../hero.service');
var ChartsComponent = (function () {
    function ChartsComponent(router, heroService, errorHandler) {
        this.router = router;
        this.heroService = heroService;
        this.errorHandler = errorHandler;
        this.data = [];
        this.options = {
            chart: {
                type: 'bar'
            },
            title: { text: 'simple chart' },
            xAxis: {
                type: 'category',
                labels: {
                    //rotation: -45,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            },
            series: [{
                    data: [],
                }]
        };
    }
    ChartsComponent.prototype.saveInstance = function (chartInstance) {
        var isFirstLoad = !this.chart;
        this.chart = chartInstance;
        if (isFirstLoad) {
            this.loadData();
        }
    };
    ChartsComponent.prototype.loadData = function () {
        var _this = this;
        this.chart.showLoading();
        this.heroService.authorsBooksCount()
            .then(function (data) {
            _this.options = {
                series: [{
                        name: 'Books count',
                        data: data.map(function (d) { return [d.name, d.value]; })
                    }]
            };
            _this.chart.hideLoading();
        })
            .catch(function (err) { return _this.errorHandler.displayDialog(err); });
    };
    ChartsComponent.prototype.ngOnInit = function () {
        return;
    };
    ChartsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: 'charts.component.html',
            styleUrls: ['charts.component.css'],
            selector: 'charts'
        }), 
        __metadata('design:paramtypes', [router_1.Router, hero_service_1.HeroService, error_handler_1.ErrorHandler])
    ], ChartsComponent);
    return ChartsComponent;
}());
exports.ChartsComponent = ChartsComponent;
