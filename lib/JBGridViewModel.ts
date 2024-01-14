import React, { createContext, useContext } from 'react';
import { observable, extendObservable, makeObservable, action } from 'mobx';
import { AnyObject, JBGridBridgeClassInterface, JBGridBridgeInterface, JBGridColumnDef, JBGridConfig, JBGridConfigInterface, JBGridFilter, JBGridResponseData, JBGridRowData, JBGridRowDataDetail, JBGridRowDetail, JBGridStyles, SearchbarConfig } from './Types';
import { JBGridProps } from './JBGrid';
import { JBSearchbarWebComponent } from 'jb-searchbar';
class JBGridViewModel<T extends AnyObject>{
    //we write computed style of grid here
    styles:JBGridStyles = {
        table: {
            generalCols: {
                gridTemplateColumns: "auto",

            },
            fullWidthCol: {
                gridColumn: '1 / end'
            },
            scrollIndent: {
                width: 'calc(100% - 17px)'
            },
            mainRowStyle: {
                gridTemplateColumns: "auto",
            }
        },
        searchBar: {
        },
        contentWrapper: {
        }
    }
    elements = {
        refreshIcon: React.createRef<SVGElement>(),
        searchbar: React.createRef<any>()
    }
    //the whole component DOM store(refrenced) in this variable
    JBGridComponentDom: HTMLDivElement | null = null;
    //keep wrapper DOM element for some pupose like wrapper changing in full screen functionality
    gridWrapperElement: HTMLElement | null = null;
    //when we start fetch new data from server it get true until load data is finished
    isLoading = false;
    //define bridge to convert grid data to server compatible data and convert server data to grid understandable format
    dataBridge: JBGridBridgeInterface;
    //add debounse feature to grid gotopage function
    paganitionDebounce;
    //keep grid searchbar height so on height 
    isErrorOccurred = false;
    filter: JBGridFilter = {
        config: null,
        value: []
    }
    callBacks = {
        onFullscreenChange: (_: boolean) => { console.error('you must set onFullscreenChange callback to jbgrid componnent if you want it to work'); }
    }
    config: JBGridConfig<T>;
    constructor(onFullscreenChange:(isFullScreen:boolean)=>void, config: JBGridConfigInterface<T>, bridge: JBGridBridgeClassInterface) {
        makeObservable(this, {
            styles: observable,
            isLoading: observable,
            isErrorOccurred: observable,
            filter: observable,
            exitFullScreenGrid: action,
            fullScreenGrid: action,
            goToLastPage: action,
            fetchGridData: action,
            mergeObject: action,
            sendFirstRequest: action,
            refreshBtnClick: action.bound,
            setSortColumn:action.bound,
        });
        if (config == undefined || config == null) {
            //when user dont pass config prop
            console.error("JBGrid need you to pass config as a prop to it \n and currently its null or undefined");
        }
        const observableConfig = observable(config);
        this.paganitionDebounce = this.debounce(this.refreshData, 300);

        //TODO:add trigger function so user can call grif functions out side of grid js file
        const triggers = {
            refreshData: () => this.refreshData(),
            fullScreenGrid: () => this.fullScreenGrid(),
            exitFullScreenGrid: () => this.exitFullScreenGrid()
        };
        this.config = observableConfig;
        if (typeof bridge != 'function') {
            //TODO: remove this line
            console.error('JBGrid need Bridge to perform well');
        }
        this.dataBridge = new bridge();
        if (typeof onFullscreenChange == "function") {
            this.callBacks.onFullscreenChange = onFullscreenChange;
        }
        this.InitGrid();
    }
    InitGrid() {
        //init grid config on load or change
        this.InitSize();

    }
    onComponentDidMount(searchbarConfig) {
        this.sendFirstRequest();
        this.initFilter(searchbarConfig);
    }
    mergeObject(inputConfig, defaultConfig) {
        const addedProperty = {};
        for (const prop in defaultConfig) {
            if (inputConfig[prop] == undefined || inputConfig[prop] == null) {
                addedProperty[prop] = defaultConfig[prop];
            }
        }
        extendObservable(inputConfig, addedProperty);
        return inputConfig;
    }
    sendFirstRequest() {
        this.isLoading = true;
        this.fetchGridData().then(() => {
            this.isLoading = false;
            this.hideErrorPanel();
        }).catch((e) => {
            this.isLoading = false;
            this.showErrorPanel();
        });
    }
    initFilter(searchbarConfig: SearchbarConfig) {
        if (searchbarConfig) {
            this.elements.searchbar.current.columnList = searchbarConfig.columnList;
            this.elements.searchbar.current.searchOnChange = searchbarConfig.searchOnChange === true ? searchbarConfig.searchOnChange : false;
            this.elements.searchbar.current.addEventListener('search', (e: CustomEvent) => {
                this.elements.searchbar.current.isLoading = true;
                const target = e.target as JBSearchbarWebComponent;
                this.onSearch(target.value).finally(() => {
                    this.elements.searchbar.current.isLoading = false;
                });
            });
            //this.elements.searchbar.current.addEventListener('');
            this.filter.config = searchbarConfig;

        }
    }
    InitSize() {
        //init table width column
        const scrollWidth = this.getScrollbarWidth();
        this.styles.table.scrollIndent.width = 'calc(100% - ' + scrollWidth + 'px)';
        //config css grid for table layout
        let gridTemplateColumns = "";
        this.config.table.columns.map((item, index) => {
            if (item.width != null || item.width != undefined) {
                if (typeof (item.width) == "number") {
                    gridTemplateColumns += ' ' + item.width + 'px';
                } else {
                    gridTemplateColumns += ' ' + item.width;
                }

            } else {
                gridTemplateColumns += " 1fr";
            }
        });
        this.styles.table.generalCols.gridTemplateColumns = gridTemplateColumns;
        this.styles.table.fullWidthCol.gridColumn = "1 / " + (this.config.table.columns.length + 1);
    }
    getScrollbarWidth() {
        const outer = document.createElement("div");
        outer.style.visibility = "hidden";
        outer.style.width = "100px";
        document.body.appendChild(outer);

        const widthNoScroll = outer.offsetWidth;
        // force scrollbars
        outer.style.overflow = "scroll";

        // add innerdiv
        const inner = document.createElement("div");
        inner.style.width = "100%";
        outer.appendChild(inner);

        const widthWithScroll = inner.offsetWidth;

        // remove divs
        outer.parentNode?.removeChild(outer);

        return widthNoScroll - widthWithScroll;
    }
    fetchGridData() {
        const fetchGridDataPromise = new Promise((resolve, reject) => {
            const requestBody = this.CreateRequestBody();
            this.dataBridge.getData(this.config.data.requestParams, requestBody).then((data) => {
                const bridgeData = this.dataBridge.mapServerResponseDataToGridData(data);
                if (bridgeData.pageIndex == this.config.page.index) {
                    this.config.data.data = [];
                    //check user dont change page during loading time if he do we wait for latest response
                    this.standardData(bridgeData.content).then((content:JBGridRowData<T>[]) => {
                        const data = {...bridgeData,content};
                        this.onFetchSuccess(data);
                        resolve(null);
                    });
                } else {
                    console.error('jbgrid requested page index is different from response page index it maybe a bridge problem or server data problem');
                }
            }).catch((err) => {
                reject(err);
            });
        });
        return fetchGridDataPromise;
    }
    onFetchSuccess(data:JBGridResponseData<T>) {
        this.config.data.data = data.content;
        this.config.data.metaData.startItemIndex = data.startItemIndex;
        this.config.data.metaData.endItemIndex = data.endItemIndex;
        this.config.data.metaData.totalItemsCount = data.totalItemsCount;
        this.config.page.totalPages = data.totalPages;
    }
    standardData(data: AnyObject[]) {
        return new Promise<JBGridRowData<T>[]>((resolve, reject) => {
            const items:JBGridRowData<AnyObject>[] = data.map((item) => {
                const detail:JBGridRowDetail = {
                    jbGridDetail: {
                        isDeleting: false,
                        isDeleted: false,
                        isRecovering: false,
                        isExpanded: false
                    }
                }
                const row:JBGridRowData<AnyObject> = Object.assign({}, item, detail);
                return row;
            });
            //in case of user want to modify or add custom field to our observable array
            if (typeof this.config.callbacks.onDataStandarding == "function") {
                const response = this.config.callbacks.onDataStandarding<T>(items);
                if (response instanceof Promise) {
                    response.then((content) => {
                        resolve(content);
                    });
                } else {
                    resolve(response);
                }
                //end of callback block
            } else {
                resolve(items as JBGridRowData<T>[]);
            }



        });

    }
    CreateRequestBody() {
        const sortColumn = this.config.table.columns.find(x => x.sort) || null;
        const requestBody = this.dataBridge.createRequestBody(this.config.page, this.filter.value, sortColumn, this.config.data);
        return requestBody;
    }

    goToNextPage() {
        const currentPage = this.config.page.index;
        if (currentPage < this.config.page.totalPages) {
            this.goToPage(currentPage + 1);
        }

    }
    goToPrevPage() {
        const currentPage = this.config.page.index;
        if (currentPage > 1) {
            this.goToPage(currentPage - 1);
        }

    }
    goToLastPage() {
        const currentPage = this.config.page.index;
        if (currentPage != this.config.page.totalPages) {
            this.goToPage(this.config.page.totalPages);
        }

    }
    goToFirstPage() {
        const currentPage = this.config.page.index;
        if (currentPage != 1) {
            this.goToPage(1);
        }

    }
    refreshBtnClick() {
        const anime = this.playRefreshBtnAnimation();
        this.refreshData().then(() => {
            this.stopRefreshBtnAnimation(anime);
        }).catch((e) => {
            console.error('Error while refreshing data', e);
            this.stopRefreshBtnAnimation(anime);
        });
    }
    playRefreshBtnAnimation() {
        const anime = this.elements.refreshIcon.current!.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }], { id: 'rotate', duration: 400, direction: "reverse", iterations: Infinity });
        return anime;
    }
    stopRefreshBtnAnimation(anime: Animation) {
        anime.cancel();
    }
    goToPage(destinitionPageIndex: number) {
        return new Promise((resolve, reject) => {
            //for navigate in pages you must call this function and every other way is forbidden
            this.config.page.index = destinitionPageIndex;
            this.paganitionDebounce()
                .then(() => {
                    resolve(null);
                    if (this.config.callbacks.onPageIndexChange) {
                        this.config.callbacks.onPageIndexChange(destinitionPageIndex);
                    }
                }).catch((e) => {
                    reject(e);
                });
        });
    }
    debounce(func: any, delay: number) {
        //create a waiting time for serial function call and execute last function execute request
        let inDebounce: ReturnType<typeof setTimeout>;
        const debounseInstance = (...inputs)=>{
            return new Promise((resolve, reject) => {
                const self: JBGridViewModel<T> = this;
                const args = inputs;
                clearTimeout(inDebounce);
                inDebounce = setTimeout(
                    () => func.apply(self, args)
                        .then((args) => {
                            resolve(args);
                        }).catch((e) => { reject(e); })
                    , delay);
            });
        };
        return debounseInstance;
    }
    refreshData() {
        const refreshDataPromise = new Promise((resolve, reject) => {
            this.isLoading = true;
            this.fetchGridData().then(() => {
                this.isLoading = false;
                this.hideErrorPanel();
                resolve(null);
            }).catch((e) => {
                this.isLoading = false;
                this.showErrorPanel();
                reject(e);
            });
        });
        //every time we need to change showing data we must call this func
        return refreshDataPromise;
    }
    onSearch(filterList) {
        this.filter.value = filterList;
        const onSearchPromise = new Promise((resolve, reject) => {
            this.goToPage(1).then(() => {
                resolve(null);
            }).catch((e) => {
                reject(e);
            });
        });
        return onSearchPromise;
    }
    onPageSizeChange(e) {
        this.config.page.size = parseInt(e.target.value);
        this.goToPage(1);
    }
    onFullScreenBtnClicked(currentValue: boolean) {
        const newValue = !currentValue;
        this.callBacks.onFullscreenChange(newValue);
    }
    onFullscreenChanged(newValue:boolean) {
        if (newValue == true) {
            this.fullScreenGrid();
        } else {
            this.exitFullScreenGrid();
        }
    }
    fullScreenGrid() {
        //TODO: handle if another grid is open before new request come up
        const container = document.createElement('div');
        container.classList.add('jb-grid-full-screen-container');
        document.body.append(container);
        this.JBGridComponentDom
        const child = document.createElement('div');
        child.innerHTML = "";
        this.gridWrapperElement = this.JBGridComponentDom!.parentElement!;
        container.append(this.JBGridComponentDom as Node);
        //TODO:call on full screen call back
    }
    exitFullScreenGrid() {
        const container = document.querySelector('.jb-grid-full-screen-container') as HTMLDivElement;
        if (this.gridWrapperElement) {
            //put grid element back to their orginal place
            this.gridWrapperElement.append(this.JBGridComponentDom as Node);
            //remove added temp fullscreen container
        }
        container[0].remove();
    }
    setSortColumn(column:JBGridColumnDef) {
        if (column.sortable) {
            if (column.sort) {
                //if we just change sort order 
                column.sort = column.sort.toUpperCase() == "ASC" ? "DESC" : "ASC";
            } else {
                //we user chnge sort column
                const prevColumnSort = this.config.table.columns.find(x => x.sort);
                if (prevColumnSort) {
                    prevColumnSort.sort = undefined;
                }
                column.sort = "ASC";
            }
            this.refreshData();
        }
    }
    changePageNumberToInput() {
        //when user click on page number
        //TODO: change page Input method to text input
        const pageNumber: string | null = prompt("شماره صفحه ای که میخواهید وارد آن شوید را وارد کنید", this.config.page.totalPages.toString());
        if (pageNumber && parseInt(pageNumber) > 0 && parseInt(pageNumber) < this.config.page.totalPages) {
            this.goToPage(parseInt(pageNumber));
        }
    }
    openSearchHeaderSection() {
        this.elements.searchbar.current.focus();
        this.config.states.headerSection = "SEARCH";
    }
    openMainHeaderSection() {
        this.config.states.headerSection = "MAIN";
    }
    showErrorPanel() {
        //when we couldnt connect to server or get error from server for our request we show error panel to user
        this.isErrorOccurred = true;
    }
    hideErrorPanel() {
        this.isErrorOccurred = false;
    }
    toPersianNumber(input: string | number) {
        const inputString = input.toString();
        const correctedString = inputString.replace(/[0-9]/g, function (word) {
            return String.fromCharCode(1776 + parseInt(word));
        });
        return (correctedString);
    }

}

export default JBGridViewModel;
export const JBGridContext = createContext<JBGridViewModel<AnyObject> | null>(null);
export const useJBGridVM = () => useContext(JBGridContext);