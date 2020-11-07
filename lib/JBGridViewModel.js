import React from 'react';
import { observable, extendObservable, makeObservable, makeAutoObservable } from 'mobx';
class JBGridViewModel {
    //we write computed style of grid here
    @observable styles = {
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
        refreshIcon: React.createRef(),
        searchbar: React.createRef()
    }
    //the whole component DOM store(refrenced) in this variable
    JBGridComponentDom = null;
    //keep wrapper DOM element for some pupose like wrapper changing in full screen functionality
    gridWrapperElement = null;
    //when we start fetch new data from server it get true until load data is finished
    @observable isLoading = false;
    //define bridge to convert grid data to server compatible data and convert server data to grid understandable format
    dataBridge;
    //add debounse feature to grid gotopage function
    paganitionDebounce;
    //keep grid searchbar height so on height 
    @observable isErrorOccurred = false;
    @observable filter = {
        config: null,
        value: []
    }
    callBacks = {
        onFullscreenChange: () => { console.error('you must set onFullscreenChange callback to jbgrid componnent if you want it to work');}
    }
    constructor(props, config, bridge) {
        makeAutoObservable(this);
        if (config == undefined || config == null) {
            //when user dont pass config prop
            console.error("JBGrid need you to pass config as a prop to it \n and currently its null or undefined");
            return null;
        }
        this.config = observable(config);
        this.paganitionDebounce = this.debounce(this.refreshData, 300);
        if (this.config.styles == undefined) {
            extendObservable(this.config, {
                styles: this.styles
            });
        } else {
            this.config.styles = this.styles;
        }
        //add trigger function so user can call grif functions out side of grid js file
        let triggers = {
            refreshData: () => this.refreshData(),
            fullScreenGrid: () => this.fullScreenGrid(),
            exitFullScreenGrid: () => this.exitFullScreenGrid()
        };
        if (this.config.triggers == undefined) {
            extendObservable(this.config, {
                triggers: triggers
            });
        } else {
            this.config.triggers = triggers;
        }
        if (typeof bridge != 'function') {
            this.dataBridge = new bridge();
            console.error('JBGrid need Bridge to perform well');
        } else {
            this.dataBridge = new bridge();
        }
        if (typeof props.onFullscreenChange == "function") {
            this.callBacks.onFullscreenChange = props.onFullscreenChange;
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
    onComponentDidUpdate(prevProps, newProps) {
        if (prevProps.isFullscreen !== newProps.isFullscreen) {
            this.onFullscreenChanged(newProps.isFullscreen);
        }
    }
    mergeObject(inputConfig, defaultConfig) {
        var addedProperty = {}
        for (var prop in defaultConfig) {
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
    initFilter(searchbarConfig) {
        if (searchbarConfig) {
            this.elements.searchbar.current.columnList = searchbarConfig.columnList;
            this.elements.searchbar.current.addEventListener('search',(e)=>{
                this.elements.searchbar.current.isLoading = true;
                this.onSearch(e.target.value).finally(()=>{
                    this.elements.searchbar.current.isLoading = false;
                });
            });
            //this.elements.searchbar.current.addEventListener('');
            this.filter.config = searchbarConfig;

        }
    }
    InitSize() {
        //init table width column
        let scrollWidth = this.getScrollbarWidth();
        this.styles.table.scrollIndent.width = 'calc(100% - ' + scrollWidth + 'px)';
        //config css grid for table layout
        var gridTemplateColumns = "";
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
        var outer = document.createElement("div");
        outer.style.visibility = "hidden";
        outer.style.width = "100px";
        outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

        document.body.appendChild(outer);

        var widthNoScroll = outer.offsetWidth;
        // force scrollbars
        outer.style.overflow = "scroll";

        // add innerdiv
        var inner = document.createElement("div");
        inner.style.width = "100%";
        outer.appendChild(inner);

        var widthWithScroll = inner.offsetWidth;

        // remove divs
        outer.parentNode.removeChild(outer);

        return widthNoScroll - widthWithScroll;
    }
    fetchGridData() {
        var fetchGridDataPromise = new Promise((resolve, reject) => {
            var requestBody = this.CreateRequestBody();
            this.dataBridge.getData(this.config.data, requestBody).then((data) => {
                var bridgeData = this.dataBridge.mapServerResponseDataToGridData(data);
                if (bridgeData.pageIndex == this.config.page.index) {
                    this.config.data.data = [];
                    //check user dont change page during loading time if he do we wait for latest response
                    this.standardData(bridgeData).then((data) => {
                        this.config.data.data = data.content;
                        this.config.data.itemsInformation.startItemIndex = data.startItemIndex;
                        this.config.data.itemsInformation.endItemIndex = data.endItemIndex;
                        this.config.data.itemsInformation.totalItemsCount = data.totalItemsCount;
                        this.config.page.totalPages = bridgeData.totalPages;
                        resolve();
                    });
                }else{
                    console.error('jbgrid requested page index is different from response page index it maybe a bridge problem or server data problem');
                }
            }).catch((err) => {
                reject(err);
            });
        });
        return fetchGridDataPromise;
    }
    standardData(data) {
        return new Promise((resolve, reject) => {
            var items = data.content;
            for (var item of items) {
                item.jbGridDetail = {
                    isDeleting: false,
                    isDeleted: false,
                    isRecovering: false,
                    isCollapsed: true
                };
            }
            //in case of user want to modify or add custom field to our observable array
            if (this.config.callbacks.onDataStandarding) {
                var response = this.config.callbacks.onDataStandarding(data);
                if (response instanceof Promise) {
                    response.then((data) => {
                        resolve(data);
                    })
                } else {
                    resolve(data);
                }
                //end of callback block
            } else {
                resolve(data);
            }



        });

    }
    CreateRequestBody() {
        var sortColumn = this.config.table.columns.find(x => x.sort);
        var requestBody = this.dataBridge.createRequestBody(this.config.page, this.filter.value, sortColumn);
        return requestBody;
    }

    goToNextPage(event) {
        var currentPage = this.config.page.index;
        if (currentPage < this.config.page.totalPages) {
            this.goToPage(currentPage + 1);
        }

    }
    goToPrevPage(event) {
        var currentPage = this.config.page.index;
        if (currentPage > 1) {
            this.goToPage(currentPage - 1);
        }

    }
    goToLastPage(event) {
        var currentPage = this.config.page.index;
        if (currentPage != this.config.page.totalPages) {
            this.goToPage(this.config.page.totalPages)
        }

    }
    goToFirstPage(event) {
        var currentPage = this.config.page.index;
        if (currentPage != 1) {
            this.goToPage(1);
        }

    }
    refreshBtnClick(event) {
        var anime = this.playRefreshBtnAnimation();
        this.refreshData().then(() => {
            this.stopRefreshBtnAnimation(anime);
        }).catch((e) => {
            this.stopRefreshBtnAnimation(anime);
        });
    }
    playRefreshBtnAnimation() {
        var anime = this.elements.refreshIcon.current.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }], { id: 'rotate', duration: 400, direction: "reverse", iterations: Infinity });
        return anime;
    }
    stopRefreshBtnAnimation(anime) {
        anime.cancel();
    }
    goToPage(destinitionPageIndex) {
        return new Promise((resolve, reject) => {
            //for navigate in pages you must call this function and every other way is forbidden
            this.config.page.index = destinitionPageIndex;
            this.paganitionDebounce()
                .then(() => {
                    resolve();
                    if (this.config.callbacks.onPageIndexChange) {
                        this.config.callbacks.onPageIndexChange(destinitionPageIndex);
                    }
                }).catch((e) => {
                    reject(e);
                });
        });
    }
    debounce(func, delay) {
        //create a waiting time for serial function call and execute last function execute request
        let inDebounce
        var debounseInstance = function () {
            return new Promise((resolve, reject) => {
                const context = this;
                const args = arguments;
                clearTimeout(inDebounce);
                inDebounce = setTimeout(() => func.apply(context, args).then((args) => {
                    resolve(args);
                }).catch((e) => { reject(e)}), delay);
            });
        };
        return debounseInstance;
    }
    refreshData() {
        var refreshDataPromise = new Promise((resolve, reject) => {
            this.isLoading = true;
            this.fetchGridData().then(() => {
                this.isLoading = false;
                this.hideErrorPanel();
                resolve();
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
        var onSearchPromise = new Promise((resolve, reject) => {
            this.goToPage(1).then(() => {
                resolve();
            }).catch((e) => {
                reject(e);
            });
        });
        return onSearchPromise;
    }
    onPageSizeChange(e) {
        this.config.page.size = e.target.value;
        this.goToPage(1);
    }
    onFullScreenBtnClicked(currentValue) {
        const newValue = !currentValue;
        this.callBacks.onFullscreenChange(newValue);
    }
    onFullscreenChanged(newValue) {
        if (newValue == true) {
            this.fullScreenGrid();
        } else {
            this.exitFullScreenGrid();
        }
    }
    fullScreenGrid() {
        //TODO: handle if another grid is open before new request come up
        var container = document.createElement('div');
        container.classList.add('jb-grid-full-screen-container');
        document.body.append(container);
        this.JBGridComponentDom
        var child = document.createElement('div');
        child.innerHTML = "";
        this.gridWrapperElement = this.JBGridComponentDom.parentElement;
        container.append(this.JBGridComponentDom);
        //TODO:call on full screen call back
    }
    exitFullScreenGrid() {
        var container = document.getElementsByClassName('jb-grid-full-screen-container');
        //put grid element back to their orginal place
        this.gridWrapperElement.append(this.JBGridComponentDom);
        //remove added temp fullscreen container
        container[0].remove();
    }
    setSortColumn(column) {
        if (column.sortable) {
            if (column.sort) {
                //if we just change sort order 
                column.sort = column.sort.toUpperCase() == "ASC" ? "DESC" : "ASC";
            } else {
                //we user chnge sort column
                var prevColumnSort = this.config.table.columns.find(x => x.sort);
                if (prevColumnSort) {
                    prevColumnSort.sort = undefined;
                    column.sort = "ASC";
                }
            }
            this.refreshData();
        }
    }
    changePageNumberToInput() {
        //when user click on page number
        //TODO: change page Input method to text input
        var pageNumber = prompt("شماره صفحه ای که میخواهید وارد آن شوید را وارد کنید", this.config.page.totalPages);
        if (parseInt(pageNumber) > 0 && parseInt(pageNumber) < this.config.page.totalPages) {
            this.goToPage(parseInt(pageNumber));
        }
    }
    openSearchHeaderSection() {
        this.elements.searchbar.current.focus();
        this.config.states.headerSection = "search";
    }
    openMainHeaderSection() {
        this.config.states.headerSection = "main";
    }
    showErrorPanel() {
        //when we couldnt connect to server or get error from server for our request we show error panel to user
        this.isErrorOccurred = true;
    }
    hideErrorPanel() {
        this.isErrorOccurred = false;
    }
    toPersianNumber(input) {
        var inputString = input.toString();
        var correctedString = inputString.replace(/[0-9]/g, function (word) {
            return String.fromCharCode(1776 + parseInt(word));
        });
        return (correctedString);
    }

}

export default JBGridViewModel;
