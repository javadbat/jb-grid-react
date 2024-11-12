import { FilterColumn, JBSearchbarValue } from "jb-searchbar/types.js";


// export type JBGridRowData = {
//     [key: keyof T]: any,
//     jbGridDetail: {
//         isDeleting: boolean,
//         isDeleted: boolean,
//         isRecovering: boolean,
//         isExpanded: boolean
//     }
// }
export type JBGridRowDataDetail = {
    isDeleting: boolean,
    isDeleted: boolean,
    isRecovering: boolean,
    isExpanded: boolean
}
export type JBGridRowDetail = { jbGridDetail: JBGridRowDataDetail };
export type AnyObject = {
    [key: string]: any;
}
export type JBGridStyles = {
    table: {
        generalCols: {
            gridTemplateColumns: string,

        },
        fullWidthCol: {
            gridColumn: string
        },
        scrollIndent: {
            width: string
        },
        mainRowStyle: {
            gridTemplateColumns: string,
        }
    },
    searchBar: any,
    contentWrapper: any
}
export type JBGridRowData<T extends AnyObject> = T & JBGridRowDetail;

export type JBGridResponseData<T extends AnyObject> = {
    pageIndex: number,
    startItemIndex: number,
    endItemIndex: number,
    totalItemsCount: number,
    totalPages: number,
    content: JBGridRowData<T>[],
}
export type JBGridFilter = {
    config: SearchbarConfig | null,
    value: JBSearchbarValue
}
export type SearchbarConfig = {
    columnList: FilterColumn[],
    searchOnChange: boolean
}
export interface JBGridBridgeInterface {
    mapServerResponseDataToGridData: (data: any) => JBGridResponseData<any>,
    getData: (data: JBGridConfigRequestParams, requestBody: any) => Promise<any>,
    createRequestBody: (page: JBGridDataPage, filter?: JBSearchbarValue, sortColumn?: JBGridColumnDef | null, requestConfig?: JBGridConfigRequestParams) => any
}
// export interface JBGridBridgeClassInterface {
//     new(): JBGridBridgeInterface
// }
type ClassBuilder<I, Args extends any[] = any[]> = new (...args: Args) => I;

export type JBGridBridgeClassInterface = ClassBuilder<JBGridBridgeInterface, []>;
//
export type JBGridDataPage = {
    index: number,
    size: number,
    totalPages: number,
}
export type JBGridColumnDef = {
    width?: string | number,
    sort?: "ASC" | "DESC" | undefined,
    sortable?: boolean,
    id: number,
    title: string,
    name: string
}
export type JBGridConfigRequestParams = {
    method?: "POST" | "GET",
    url?: string,
    //user can add any parameter needed to create request in his app
    [key: string]: any
}
export type JBGridDataConfig<T extends AnyObject> = {
    data: JBGridRowData<T>[],
    //TODO: make it as a Generic type so user can standard it in whole app
    requestParams: JBGridConfigRequestParams,
    metaData: {
        startItemIndex: number,
        endItemIndex: number,
        totalItemsCount: number
    }
};
export type JBGridTableConfig = {
    columns: JBGridColumnDef[]
}
export type JBGridConfigStates = {
    headerSection: 'MAIN' | "SEARCH",
    isFullScreen: boolean
}
export type JBGridCallbackConfig<T extends AnyObject> = {
    onDataStandardizing: ((data: JBGridRowData<AnyObject>[]) => JBGridRowData<T>[]) | (<T extends AnyObject>(data: JBGridRowData<AnyObject>[]) => Promise<JBGridRowData<T>[]>) | null | undefined,
    onPageIndexChange: ((newPageIndex: number) => unknown) | null | undefined
}
export type JBGridI18nMessage = {
    serverErrorText?: string,
    serverErrorTitle?: string,
    serverErrorRefreshButtonTitle?: string,
    EnterPageNumberMessage?: string,
    currentAvailableItem?: string,
    pageItemCount?:string,
    from?:string
}
export type JBGridI18nConfig = {
    messages?: JBGridI18nMessage,
    showPersianNumber?: boolean
}
export type ActionDispatchers = Readonly<{
    refreshData: () => Promise<void>,
    fullScreenGrid: () => void,
    exitFullScreenGrid: () => void
}>
export interface JBGridConfigInterface<T extends AnyObject> {

    table: JBGridTableConfig
    data: JBGridDataConfig<T>,
    page: JBGridDataPage,
    callbacks: JBGridCallbackConfig<T>,
    actionDispatchers?: ActionDispatchers,
    states: JBGridConfigStates,
}
export type JBGridConfig<T extends AnyObject> = JBGridConfigInterface<T>;
export type JBGridCallbacks = {
    onFullscreenChange: (isFullscreen: boolean) => void
}