import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./account/guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
  // Dashboard
  {
    path: "dashboard",
    canActivate: [AuthGuard],
    loadChildren: "./dashboard/dashboard.module#DashboardPageModule",
  },
  // Login
  {
    path: "login",
    loadChildren: "./account/login/login.module#LoginPageModule",
  },
  // Calendar
  {
    path: "calendar",
    loadChildren: "./pages/calendar/calendar.module#CalendarPageModule",
  },
  // Contacts
  {
    path: "contacts",
    loadChildren: "./pages/contacts/contacts.module#ContactsPageModule",
  },
  // Order Drafts
  // {
  //   path: 'draftCreate',
  //   loadChildren: './pages/drafts/draftCreate/draftCreate.module#DraftCreatePageModule'
  // },
  {
    path: "draftDetail/:id",
    loadChildren:
      "./pages/drafts/draftDetail/draftDetail.module#DraftDetailPageModule",
  },
  {
    path: "draftMain",
    loadChildren:
      "./pages/drafts/draftMain/draftMain.module#DraftMainPageModule",
  },
  {
    path: "draftList",
    loadChildren:
      "./pages/drafts/draftList/draftList.module#DraftListPageModule",
  },
  // Notifications
  {
    path: "notifications",
    loadChildren:
      "./pages/notifications/notifications.module#NotificationsPageModule",
  },
  // Orders
  {
    path: "orderCreate",
    loadChildren:
      "./pages/orders/orderCreate/orderCreate.module#OrderCreatePageModule",
  },
  {
    path: "orderDetail/:id",
    loadChildren:
      "./pages/orders/orderDetail/orderDetail.module#OrderDetailPageModule",
  },
  {
    path: "orderAuthDetail/:id",
    loadChildren:
      "./pages/orders/orderAuthDetail/orderAuthDetail.module#orderAuthDetailModule",
  },
  {
    path: "orderList",
    loadChildren:
      "./pages/orders/orderList/orderList.module#OrderListPageModule",
  },
  {
    path: "orderMain",
    loadChildren:
      "./pages/orders/orderMain/orderMain.module#OrderMainPageModule",
  },
  {
    path: "orderPendingDetail/:id",
    loadChildren:
      "./pages/orders/orderPendingDetail/orderPendingDetail.module#OrderPendingDetailPageModule",
  },
  // Products
  {
    path: "products",
    loadChildren: "./pages/products/products.module#ProductsPageModule",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
