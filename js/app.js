
angular.module('NarrowItDownApp',[])
.controller('NarrowItDownController',NarrowItDownController)
.service('MenuSearchService',MenuSearchService)
.directive('foundItems',FoundItemsDirective );


function FoundItemsDirective() {
  var ddo ={

      scope : {

        titles:"<",
        found:"<",
        remove : "&"

      },
      templateUrl : "foundItems.html",
      controller : FoundItemsDirectiveController,
      controllerAs : 'founds',
      bindToController: true

  };

  return ddo;
}

function FoundItemsDirectiveController() {
  var founds = this;
  console.log(founds.found);
  founds.isDataComing = function() {
    if(founds.found.length == 0)
      return false
    return true ;
  }

}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var narrow = this ;

  narrow.found = [];


narrow.titles = {
    // no : "NO",
    name :"NAME",
    description : "DESCRIPTION",
    short_name : "SHORT NAME"


};

narrow.removeMenuItem = function (index) {
  MenuSearchService.removeItem(index);
}

 narrow.getItems = function (searchValue) {

   // returning a promise and then function is usable
   var promise =MenuSearchService.getMatchedMenuItems(searchValue);
   promise.then(function(items){
     narrow.found = items;
     if(narrow.found.length > 0 ){
        narrow.searched = false ;}
     else {
        narrow.searched = true ;
     }
       console.log(narrow.found);
   }).catch(function (error) {
    console.log("Something went terribly wrong.");
  });

 }

}

MenuSearchService.$inject = ['$http']
function MenuSearchService($http) {
    var menu = this ;
    items = [];
    // menu.getMenuItems = function () {
    //     return menu.items ;
    // }
    menu.getMatchedMenuItems = function (searchValue) {
         return $http({
        method : "GET",
        url : ("https://davids-restaurant.herokuapp.com/menu_items.json"),
        params:{}
      })
      .then(function(result) {

        items  = getMatchedData(searchValue,result);
        return items ;
      });
        // return menuItems ;


    }

    menu.removeItem = function(index){

        items.splice(index,1);

    }



    function getMatchedData(searchValue,result) {
      var returnItems = [];
      if(!searchValue){
        
        return  returnItems ;
      }
      var items  =  result.data.menu_items;

      for (var i = 0; i < items.length; i++) {
        if (items[i].description.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1) {
                returnItems.push(items[i]);
      }
    }

    return returnItems ;
  }
}