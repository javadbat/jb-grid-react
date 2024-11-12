import { makeObservable, observable } from 'mobx';
import { JBGridConfigStates, JBGridDataPage, JBGridTableConfig,JBGridCallbackConfig, JBGridI18nConfig, JBGridDataConfig, JBGridConfigInterface, AnyObject } from './Types.js';

class JBGridData<T extends AnyObject> implements JBGridConfigInterface<T> {
  constructor(){
    makeObservable(this,{
      table:observable,
      data:observable,
      page:observable,
      states:observable
    });
  }
    table:JBGridTableConfig = {
      columns: []
    }
    data:JBGridDataConfig<T> = {
      data: [],
      requestParams:{
        method:"GET",
        url:""
      },
      //keep detail of which items we show in a grid and detail of what information do we have
      metaData: {
        startItemIndex: 0,
        endItemIndex: 0,
        totalItemsCount: 0
      }
    }
    page:JBGridDataPage = {
      index: 1,
      size: 20,
      totalPages: 1,
    }
    states:JBGridConfigStates = {
      headerSection: "MAIN",
      isFullScreen: false
    }
    callbacks:JBGridCallbackConfig<any> = {
      //TODO: define standard callback for grid like onRefresh , onDataLoad ,onFullScreen , onFilter ,....
      onPageIndexChange: null, //when grid pageIndex change
      onDataStandardizing: null //when we retrive new data and let outside programmer change the data structure before it compile

    }
    /**
     * @deprecated provide it as a prop
     */
    customComponents = {
      headerEnd: []
    }
}
export {JBGridData};
