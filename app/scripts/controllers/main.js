'use strict';

angular.module('carPoolExpenseApp')
  .controller('MainCtrl', function ($scope, $localStorage, $window) {

    $scope.generate = function(){
      var fromDate = $scope.input.fromDate,
          toDate   = $scope.input.toDate,
          days     = [];

      if(fromDate > toDate) { $window.alert('to date cannot be in the past of from date'); return; }

      var daysRange = moment(fromDate).twix(toDate, true).iterate('days');

      while(daysRange.hasNext()){ days.push( moment(daysRange.next()).format('DD/MM/YYYY') ); }

      var newRecords = days.map(function(day){
        var record = $.extend({}, $scope.input);
        record.day = day;
        record.expenditure = Math.round((record.dieselPrice * record.distance) / record.mileage);
        return record;
      });

      $scope.records = $scope.records.concat(newRecords);
    };

    $scope.stats = function(){
      return {
        total: $scope.records.reduce(function(previousValue, currentValue){ return previousValue + currentValue.expenditure; }, 0)
      };
    };

    $scope.remove = function(record, event){
      var index = $scope.records.indexOf(record);
      $scope.records.splice(index, 1);
      event.preventDefault();
    };

    $scope.clear = function(){
      $scope.records = [];
    };

    $scope.records = $localStorage.records || [];
    $scope.input = $localStorage.input || {};

    var followAndPersist = function(field){
      $scope.$watch(field, function(data){
        $localStorage[field] = data;
      }, true);
    };

    followAndPersist('records');
    followAndPersist('input');
  });
