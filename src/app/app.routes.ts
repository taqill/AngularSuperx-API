import { Routes } from '@angular/router'
import { LoginComponent } from './components/login/login.component'
import { RegisterComponent } from './components/register/register.component'
import { DashboardComponent } from './components/dashboard/dashboard.component'
import { StockComponent } from './components/stock/stock.component'
import { authGuard } from './auth/auth.guard'
import { EventComponent } from './components/event/event.component'
import { UserComponent } from './components/user/user.component'
import { UserProfileComponent } from './components/user-profile/user-profile.component'


export const routes: Routes = [
    { 
        path: '', 
        pathMatch: 'full', 
        redirectTo: 'login' 
    },
    {
        path: 'login',
        component: LoginComponent,
        data: { title: 'Login' }
    },
    {
        path: 'register',
        component: RegisterComponent,
        data: { title: 'Register' }
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
        data: { title: 'Dashboard' }
    },
    {
        path: 'stock',
        component: StockComponent,
        canActivate: [authGuard],
        data: { title: 'Stock' }
    },
    {
        path: 'event',
        component: EventComponent,
        canActivate: [authGuard],
        data: { title: 'Event' }
    },
    {
        path: 'user',
        component: UserComponent,
        canActivate: [authGuard],
        data: { title: 'UserManagement' }
    },
    {
        path: 'userprofile',
        component: UserProfileComponent,
        canActivate: [authGuard],
        data: { title: 'User Profile' }
    },
    {
        path: '**',
        redirectTo: 'login'
    }
]