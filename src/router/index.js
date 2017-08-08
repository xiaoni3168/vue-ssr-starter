import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const TestView = () => import('../components/Test.vue');
const SigninView = () => import('../views/SigninView.vue');

export function createRouter () {
    return new Router({
        mode: 'history',
        scrollBehavior: () => ({ y: 0 }),
        routes: [
            {
                path: '/test',
                component: TestView
            },
            {
                path: '/signin',
                component: SigninView
            },
            {
                path: '/',
                redirect: '/test'
            }
        ]
    })
}