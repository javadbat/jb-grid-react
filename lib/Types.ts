import { FilterColumn, JBSearchbarValue } from "jb-searchbar/dist/types";

export interface JBGridBridgeClassInterface {
    new(): JBGridBridgeInterface
}
export type JBGridRowData = {
    [key: string]: any,
    jbGridDetail: {
        isDeleting: boolean,
        isDeleted: boolean,
        isRecovering: boolean,
        isExpanded: boolean
    }
}
export type JBGridResponseData = {
    pageIndex: number,
    content: JBGridRowData[],
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
    mapServerResponseDataToGridData: (data: any) => JBGridResponseData,
    getData: (data: any, requestBody: any) => Promise<any>,
    createRequestBody: (page: JBGridDataPage, filter: JBSearchbarValue, sortColumn: JBGridColumnDef | null, data: JBGridDataConfig)=>any
}

//
export type JBGridDataPage = {
    index: number,
    size: number,
    totalPages: number,
}
export type JBGridColumnDef = {
    width?: string | number,
    sort: "ASC" | "DESC" | undefined,
    sortable: boolean,
    id: number,
    caption: string,
    name: string
}
export type JBGridDataConfig = {
    data: JBGridRowData[],
    //TODO: make it as a Generic type so user can standard it in whole app
    requestParams: {
        method?: "POST" | "GET",
        url?: string,
        //user can add any parameter needed to create request in his app
        [key: string]: any
    }
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
    onDataStandarding: ((data: JBGridResponseData) => JBGridResponseData) | null | undefined,
    onPageIndexChange: ((newPageIndex: number) => unknown) | null | undefined
}
export type JBGridi18nConfig = {
    messages: {
        serverErrorText?: string
    }
}
export interface JBGridConfigInterface {

    table: JBGridTableConfig
    data: JBGridDataConfig,
    page: JBGridDataPage,
    callbacks: JBGridCallbackConfig,
    states: JBGridConfigStates,
    i18n: JBGridi18nConfig

}
export type JBGridConfig = JBGridConfigInterface;