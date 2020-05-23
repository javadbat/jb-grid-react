import { observable }  from 'mobx'

class JBGridData  {
    @observable table = {
        columns:[]
    }
    @observable data= {
        method:"POST",
        url:'',
        data:[],
        //keep detail of which items we show in a grid and detail of what information do we have
        itemsInformation:{
            startItemIndex:0,
            endItemIndex:0,
            totalItemsCount:0
        }
    }
    @observable page = {
        index:1,
        size:20,
        totalPages:1,
    }
    @observable states = {
        headerSection:"main",// filter is another option,
        isFullScreen:false
    }
    callbacks = {
       //TODO: define standard callback for grid like onRefresh , onDataLoad ,onFullScreen , onFilteer ,....
       onPageIndexChange : null, //when grid pageIndex change
       onDataStandarding:null //when we retrive new data and let outside programmer change the data structure before it compile

    }
    customComponents={
        headerEnd:[]
    }
    captions={
        serverErrorText:"متاسفانه در هنگام بارگذاری اطلاعات خطایی رخ داده است"
    }
    fullScreenable=false

}
export default JBGridData;
