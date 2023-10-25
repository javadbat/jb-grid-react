import { FilterColumn, JBSearchbarValue } from "jb-searchbar/dist/types";


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
export type JBGridRowDetail =  {jbGridDetail:JBGridRowDataDetail};
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
export type JBGridRowData<T> = T & JBGridRowDetail;

export type JBGridResponseData<T> = {
    pageIndex: number,
    startItemIndex:number,
    endItemIndex:number,
    totalItemsCount:number,
    totalPages:number,
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
export interface JBGridBridgeInterface{
    mapServerResponseDataToGridData: (data: any) => JBGridResponseData<any>,
    getData: (data: JBGridConfigRequestParams, requestBody: any) => Promise<any>,
    createRequestBody: (page: JBGridDataPage, filter?: JBSearchbarValue, sortColumn?: JBGridColumnDef | null, requestConfig?: JBGridConfigRequestParams)=>any
}
// export interface JBGridBridgeClassInterface {
//     new(): JBGridBridgeInterface
// }
type ClassBuilder<I, Args extends any[] = any[]> = new(...args: Args) => I;

export type JBGridBridgeClassInterface = ClassBuilder<JBGridBridgeInterface,[]>;
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
export type JBGridDataConfig<T> = {
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
export type JBGridCallbackConfig = {
    onDataStandarding: (<T>(data: JBGridRowData<AnyObject>[]) => JBGridRowData<T>[]) | (<T>(data: JBGridRowData<AnyObject>[]) => Promise<JBGridRowData<T>[]>) | null | undefined,
    onPageIndexChange: ((newPageIndex: number) => unknown) | null | undefined
}
export type JBGridi18nConfig = {
    messages: {
        serverErrorText?: string
    }
}
export interface JBGridConfigInterface<T> {

    table: JBGridTableConfig
    data: JBGridDataConfig<T>,
    page: JBGridDataPage,
    callbacks: JBGridCallbackConfig,
    states: JBGridConfigStates,
    i18n: JBGridi18nConfig

}
export type JBGridConfig<T> = JBGridConfigInterface<T>;