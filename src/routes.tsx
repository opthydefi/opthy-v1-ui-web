import React, {
    Suspense,
    Fragment,
    lazy
} from 'react';

import {
    Switch,
    Redirect,
    Route
} from 'react-router-dom';

import MainLayout from 'src/layouts/MainLayout';
import LoadingScreen from 'src/components/LoadingScreen';
import Home from 'src/views/home';
import BuyContract from 'src/views/buyContract';




type Routes = {
    exact?: boolean;
    path?: string | string[];
    guard?: any;
    layout?: any;
    component?: any;
    routes?: Routes;
}[];


export const renderRoutes = (routes: Routes = []): JSX.Element => (
    <Suspense fallback={<LoadingScreen />}>
        <Switch>
            {routes.map((route, i) => {
                const Guard = route.guard || Fragment;
                const Layout = route.layout || Fragment;
                const Component = route.component;

                return (
                    <Route
                        key={i}
                        path={route.path}
                        exact={route.exact}
                        render={(props) => (
                            <Guard>
                                <Layout>
                                    {route.routes
                                        ? renderRoutes(route.routes)
                                        : <Component {...props} />}
                                </Layout>
                            </Guard>
                        )}
                    />
                );
            })}
        </Switch>
    </Suspense>
);




const routes: Routes = [
    {
        exact: true,
        path: '/404',
        component: lazy(() => import('src/views/errors/Page404'))
    },
    // {
    //   exact: true,
    //   guard: GuestGuard,
    //   path: '/login',
    //   component: lazy(() => import('src/views/au'))
    // },
    {
        path: '*',
        layout: MainLayout,
        routes: [
            {
                exact: true,
                path: '/',
                component: BuyContract
            },
            // {
            //   exact: true,
            //   path: '/pricing',
            //   component: lazy(() => import('src/views/pricing/PricingView'))
            // },

            {
                component: () => <Redirect to="/404" />
            }
        ]
    }
];

export default routes;



