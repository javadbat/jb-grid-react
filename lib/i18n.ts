import { JBGridI18nConfig, JBGridI18nMessage } from "./Types.js";

const i18nMessages:JBGridI18nMessage = {
  EnterPageNumberMessage:"شماره صفحه ای که میخواهید وارد آن شوید را وارد کنید",
  serverErrorText:"متاسفانه در هنگام بارگذاری اطلاعات خطایی رخ داده است",
  serverErrorTitle:"すみません",
  serverErrorRefreshButtonTitle:"تلاش مجدد",
  currentAvailableItem:"تعداد کل ایتم های موجود",
  pageItemCount:"تعداد آیتم در هر صفحه",
  from:"از",
};
export const defaultI18n:JBGridI18nConfig = {
  messages: i18nMessages,
  showPersianNumber:false
};