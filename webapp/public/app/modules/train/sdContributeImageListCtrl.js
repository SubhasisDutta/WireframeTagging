/**
 * Created by subhasis on 11/1/16.
 */
'use strict';

module.exports = sdContributeImageLabelCtrl;

function sdContributeImageLabelCtrl($scope, $resource, sdNotifier) {
    $scope.perPage = 25;
    $scope.maxSize = 5;


    function getResult() {
        var pageNo = 1;
        if($scope.userContributeData && $scope.userContributeData.page){
            pageNo = $scope.userContributeData.page;
        }
        var userContributeData = $resource("/api/contribute/userImages/" + pageNo + "/" + $scope.perPage);
        userContributeData.get().$promise.then(function(userContributeDataResult){
            for(var i in userContributeDataResult.docs) {
                var doc = userContributeDataResult.docs[i];
                doc.googleAvailable = false;
                doc.prediction_text_google = '';
                doc.prediction_label_google = ''
                var foundGoogleResult = false;
                for(var j in doc.prediction_text) {
                    if(doc.prediction_text[j].provider === 'google_text'){
                        doc.googleAvailable = true;
                        doc.prediction_text_google = doc.prediction_text[j].result;
                    }
                    if(doc.prediction_label[j].provider === 'google_label') {
                        doc.prediction_label_google = doc.prediction_label[j].result;
                    }
                }
            }
            $scope.userContributeData = userContributeDataResult;
        });
    }
    getResult();

    $scope.pageChanged = function() {
        getResult();
    };

    $scope.sortOptions = [{value: "-uploaded_on", text: "Sort by Upload Date"},
        {value: "actual_label", text: "Sort by Label"}];
    $scope.sortOrder = $scope.sortOptions[0].value;

    $scope.deleteControl = function (imageId) {
        var removeResource = new $resource('/api/contribute/removeControl/:_id',
            {_id: imageId},
            {'update': {method: 'PUT'}});
        removeResource.update().$promise.then(function(response) {
            sdNotifier.notify(response.message);
            if(response.code === 200) {
                getResult();
            }
        });
    };

    $scope.analyzeGoogleVision = function(imageId) {
        var analyzeGoogleVision = new $resource('/api/analyze/googlevision/:_id',
            {_id: imageId},
            {'update': {method: 'PUT'}});
        analyzeGoogleVision.update().$promise.then(function(response) {
            sdNotifier.notify(response.message);
        });
    };

}