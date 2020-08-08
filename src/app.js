import React from 'react';
import { Switch, BrowserRouter, Route} from 'react-router-dom';
const HomePage = React.lazy(() => import('./components/HomePage'))

export default function App() {
    return (
    <>
        <BrowserRouter>
            <React.Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    <Route path='/' exact component={HomePage} />
                    <Route path='/control' exact component={HomePage} />
                    <Route component={()=><h1>404</h1>}/>
                </Switch>
            </React.Suspense>
        </BrowserRouter>
    </>
    )
}