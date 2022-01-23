import { makeObservable, observable } from 'mobx';
import { HeaderSections } from './Types';

/**
 * @typedef JBGridColumnDef
 * @property {number} id
 * @property {string} caption
 * @property {string} name
 * @property {boolean} sortable
 * @property {string | number} width
 */

class JBGridData {
    constructor(){
        makeObservable(this,{
            table:observable,
            data:observable,
            page:observable,
            states:observable
        });
    }
    table = {
        /**
         * @type {JBGridColumnDef[]}
         */
        columns: []
    }
    data = {
        method: "POST",
        url: '',
        data: [],
        //keep detail of which items we show in a grid and detail of what information do we have
        itemsInformation: {
            startItemIndex: 0,
            endItemIndex: 0,
            totalItemsCount: 0
        }
    }
    page = {
        index: 1,
        size: 20,
        totalPages: 1,
    }
    states = {
        headerSection: HeaderSections.main,
        isFullScreen: false
    }
    callbacks = {
        //TODO: define standard callback for grid like onRefresh , onDataLoad ,onFullScreen , onFilteer ,....
        onPageIndexChange: null, //when grid pageIndex change
        onDataStandarding: null //when we retrive new data and let outside programmer change the data structure before it compile

    }
    customComponents = {
        headerEnd: []
    }
    captions = {
        serverErrorText: "متاسفانه در هنگام بارگذاری اطلاعات خطایی رخ داده است"
    }
}
export {JBGridData};
