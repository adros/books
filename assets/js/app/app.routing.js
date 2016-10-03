"use strict";
var router_1 = require('@angular/router');
var hero_detail_component_1 = require('./hero-detail.component');
var heroes_component_1 = require('./heroes.component');
var dashboard_component_1 = require('./dashboard.component');
var charts_component_1 = require('./chart/charts.component');
var appRoutes = [{
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'heroes',
        component: heroes_component_1.HeroesComponent
    }, {
        path: 'dashboard',
        component: dashboard_component_1.DashboardComponent
    }, {
        path: 'heroes/:id',
        component: hero_detail_component_1.HeroDetailComponent
    }, {
        path: 'charts',
        component: charts_component_1.ChartsComponent
    }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
