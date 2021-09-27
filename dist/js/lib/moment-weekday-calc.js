/**
 * Weekdays calculator
 * @author Andrei Kondratev [andrew@kondratev.pro]
 */
;if ( typeof require !== 'undefined' )
{
  moment = require('moment');
}
(function(moment) {

  function WeekDayCalc (rangeStart,rangeEnd,weekdays,exclusions,inclusions,useIsoWeekday) {
    this.rangeStart = moment(rangeStart);
    this.rangeEnd = moment(rangeEnd);
    this.exclusions = exclusions;
    this.inclusions = inclusions;
    this.useIsoWeekday = (useIsoWeekday==true);
    if(this.rangeStart.isAfter(this.rangeEnd)) {
      throw new WeekDayCalcException('rangeStart is after rangeEnd');
    }
    this.weekdays = parseWeekdays(weekdays, this.useIsoWeekday);
  }

  WeekDayCalc.prototype.calculate = function() {
    var weekDaysCount = 0;
    var rangeStartWeekEnd = this.rangeStart.clone().endOf('week');
    var rangeEndWeekStart = this.rangeEnd.clone().startOf('week');

    if (rangeEndWeekStart.diff(rangeStartWeekEnd,'days')<30 || this.exclusions || this.inclusions) {
      weekDaysCount = this.calculateIterative(this.rangeStart,this.rangeEnd,this.weekdays,this.exclusions, this.inclusions);
    } else {
      /* a little optimisation for longer time intervals - it works faster with intervals longer than one year */
      var wholeWeeksDiff = Math.round(rangeEndWeekStart.diff(rangeStartWeekEnd,'weeks',true));
      weekDaysCount += wholeWeeksDiff*this.weekdays.length;
      weekDaysCount += this.calculateIterative(this.rangeStart,rangeStartWeekEnd,this.weekdays);
      weekDaysCount += this.calculateIterative(rangeEndWeekStart,this.rangeEnd,this.weekdays);
    }

    return weekDaysCount;
  };

  WeekDayCalc.prototype.calculateIterative = function(rangeStart,rangeEnd,weekdays,exclusions, inclusions) {
    return this.iterateRange(rangeStart,rangeEnd,weekdays,exclusions, inclusions, null);
  };

  WeekDayCalc.prototype.iterateRange = function(rangeStart,rangeEnd,weekdays,exclusions, inclusions, iterationCallback) {
    var weekDaysCount = 0, day = rangeStart.clone();
    var str_exclusions = parseSet(exclusions);
    var str_inclusions = parseSet(inclusions);

    while(day.valueOf()<=rangeEnd.valueOf()) {
      var weekdayFunc = this.useIsoWeekday?'isoWeekday':'weekday';
      var dayString = day.format("YYYY-MM-DD");
      var included = str_inclusions.length != 0 && str_inclusions.indexOf(dayString)>=0;
      if (included || ( (weekdays.indexOf(day[weekdayFunc]())>=0) && (str_exclusions.length==0 || str_exclusions.indexOf(dayString)<0) )) {
        if(iterationCallback && typeof iterationCallback === 'function') {
          iterationCallback(day.clone());
        }
        weekDaysCount++;
      }
      day.add(1, 'day');
    }
    return weekDaysCount;
  }

  Function.prototype.construct = function(aArgs) {
    /*Monkey patching Function prototype to have construct method*/
    var fConstructor = this, fNewConstr = function() { fConstructor.apply(this, aArgs); };
    fNewConstr.prototype = fConstructor.prototype;
    return new fNewConstr();
  };

  function WeekDayCalcException (message) {
    this.message = message;
    this.name = 'WeekDayCalcException';
  }
  WeekDayCalcException.prototype = new Error;
  WeekDayCalc.prototype.WeekDayCalcException = WeekDayCalcException;

  function DaysSetConverter (rangeStart, weekdays, exclusions, inclusions, useIsoWeekday) {
    this.rangeStart = moment(rangeStart);
    this.useIsoWeekday = (useIsoWeekday==true);
    this.exclusions = exclusions;
    this.inclusions = inclusions;
    this.weekdays = parseWeekdays(weekdays, this.useIsoWeekday);
  }

  /**
   * Calculates the date of {workdays} from now excluding today
   * @param daysToAdd
   * @returns {Suite|*}
   */
  DaysSetConverter.prototype.calculate = function(daysToAdd) {
    var daysLeft = daysToAdd;
    var resultDate = this.rangeStart.clone();
    var str_exclusions = parseSet(this.exclusions);
    var str_inclusions = parseSet(this.inclusions);
    var weekdayFunc = this.useIsoWeekday?'isoWeekday':'weekday';
    if (daysLeft>=0){
        /* positive value - add days */
        while (daysLeft > 0) {
            resultDate.add(1, 'day');
            var included = str_inclusions.length != 0 && str_inclusions.indexOf(resultDate.format("YYYY-MM-DD"))>=0;
            if (included || ((this.weekdays.indexOf(resultDate[weekdayFunc]()) >= 0) && (str_exclusions.length == 0 || str_exclusions.indexOf(resultDate.format("YYYY-MM-DD")) < 0))) {
                daysLeft--;
            }
        }
    } else {
        /* negative value - subtract days */
        while (daysLeft < 0) {
            resultDate.subtract(1, 'day');
            var included = str_inclusions.length != 0 && str_inclusions.indexOf(resultDate.format("YYYY-MM-DD"))>=0;
            if (included || ((this.weekdays.indexOf(resultDate[weekdayFunc]()) >= 0) && (str_exclusions.length == 0 || str_exclusions.indexOf(resultDate.format("YYYY-MM-DD")) < 0))) {
                daysLeft++;
            }
        }
    }
    return resultDate;
  };


  function DaysSetConverterException (message) {
    this.message = message;
    this.name = 'DaysSetConverterException';
  }
  DaysSetConverterException.prototype = new Error;
  DaysSetConverter.prototype.DaysSetConverterException = DaysSetConverterException;

  var parseWeekdays = function(weekdays, useIsoWeekday) {
    var validWeekdays = [];
    if (!weekdays) {
      throw new WeekDayCalcException('weekdays must be defined');
    }
    if (weekdays.length > 7) {
      throw new WeekDayCalcException("Weekdays array exceeding week length of 7 days");
    }
    for (var i=0;i<weekdays.length;i++) {
      var weekday = weekdays[i];
      if (useIsoWeekday) {
        if (isNaN(weekday)) throw new WeekDayCalcException("isoWeekDayCalc accepts weekdays as numbers only, try using weekdayCalc if you need a locale aware behaviour");
        if (weekday<1 || weekday>7) throw new WeekDayCalcException("The weekday is out of 1 to 7 range");
      } else if(!isNaN(weekday)){
        if (weekday<0 || weekday>6) throw new WeekDayCalcException("The weekday is out of 0 to 6 range");
      } else {
        weekday = moment().day(weekday).weekday();
      }
      if (validWeekdays.indexOf(weekday)>=0) {
        throw new WeekDayCalcException("Weekdays set contains duplicate weekday");
      }
      validWeekdays.push(weekday);
    }
    return validWeekdays;
  };

  var parseSet = function(set) {
    var str_exclusions = [];
    if (set) {
      var i=0, l = set.length;
      for (;i<l;i++) {
        str_exclusions.push(moment(set[i]).format("YYYY-MM-DD"));
      }
    }
    return str_exclusions;
  };

  WeekDayCalc.parseParameters = function(that, inArgs, useIsoWeekday) {
    var rangeStart, rangeEnd, weekdays, exclusions, inclusions;
    useIsoWeekday = useIsoWeekday?true:false;
    switch (inArgs.length) {
      case 5:
        exclusions = inArgs[3];
        inclusions = inArgs[4];
      case 4:
        exclusions = inArgs[3];
        /* Fall-through to three args */
      case 3:
        rangeStart = moment(inArgs[0]).startOf('day');
        rangeEnd = moment(inArgs[1]).endOf('day');
        weekdays = inArgs[2];
        break;
      case 2:
        rangeStart = that;
        rangeEnd = inArgs[0];
        weekdays = inArgs[1];
        break;
      case 1:
        var arg = inArgs[0];
        if (arg && arg.rangeEnd && arg.weekdays) {
          rangeStart = arg.rangeStart ? moment(arg.rangeStart).startOf('day') : that;
          rangeEnd = moment(arg.rangeEnd).endOf('day');
          weekdays = arg.weekdays;
          exclusions = arg.exclusions;
          inclusions = arg.inclusions;
        } else {
          rangeStart = that.clone().startOf('year');
          rangeEnd = that.clone().endOf('year');
          weekdays = arg;
        }
        break;
      default:
        new WeekDayCalcException('unexpected arguments length '+inArgs.length+'. Expecting 1 to 4 args');
    }
    if(rangeStart.isAfter(rangeEnd)) {
      var trueEnd  = rangeStart.clone();
      rangeStart = rangeEnd.clone();
      rangeEnd = trueEnd;
    }
    return [rangeStart, rangeEnd, weekdays, exclusions, inclusions, useIsoWeekday];
  }

  WeekDayCalc.calculateWeekdays = function(that, inArgs, useIsoWeekday) {
    var calc =  WeekDayCalc.construct(WeekDayCalc.parseParameters(that, inArgs, useIsoWeekday));
    return calc.calculate();
  };

  WeekDayCalc.dateRangeToDates = function(that, inArgs, useIsoWeekday) {
    var dates = [];
    var calc =  WeekDayCalc.construct(WeekDayCalc.parseParameters(that, inArgs, useIsoWeekday));
    calc.iterateRange(calc.rangeStart,calc.rangeEnd,calc.weekdays,calc.exclusions, calc.inclusions, function(day){
      dates.push(day);
    });
    return dates;
  };

  DaysSetConverter.calculateDate = function(that, inArgs, useIsoWeekday) {
    var days, exclusions, inclusions, weekdaysSet;
    useIsoWeekday = useIsoWeekday?true:false;
    var rangeStart = that;
    switch (inArgs.length) {
      case 4:
        exclusions = inArgs[2];
        inclusions = inArgs[3];
      case 3:
        exclusions = inArgs[2];
      /* Fall-through to two args*/
      case 2:
        days = inArgs[0];
        weekdaysSet = inArgs[1];
        break;
      case 1:
        var arg = inArgs[0];
        if (arg && (arg.days!=undefined || arg.workdays!=undefined) ) {
          if (arg.days!=undefined && arg.workdays!=undefined) throw new DaysSetConverterException("days and weekdays args should not be used together, because weekdays is an alias of days");
          days = arg.days?arg.days:arg.workdays;
          weekdaysSet = arg.weekdays?arg.weekdays:[1,2,3,4,5];
          exclusions = arg.exclusions;
          inclusions = arg.inclusions;
        } else {
          days = arg;
        }
        break;
      default:
        new DaysSetConverterException('unexpected arguments length '+inArgs.length+'. Expecting 1 to 3 args');
    }
    var calc =  DaysSetConverter.construct([that, weekdaysSet, exclusions, inclusions, useIsoWeekday]);
    return calc.calculate(days);
  };

  /**
   * Calculate weekdays with locale aware weekdays
   */
  moment.fn.weekdayCalc = function(){
    return WeekDayCalc.calculateWeekdays(this, arguments);
  };

  /**
   * Calculate weekdays with moment#isoWeekdays function, where 1 is always monday and 7 is always Sunday
   */
  moment.fn.isoWeekdayCalc = function() {
    return WeekDayCalc.calculateWeekdays(this, arguments, true);
  };

  /**
   * Calculates the date of {workdays} from now excluding today
   * For example 4 workdays from Wed 19 Aug 2015 is a Tue 25 Aug 2015
   * workdays set is Mon-Fri, please use addSetWeekdays if you have a different set
   */
  moment.fn.addWorkdays = function(days, exclusions, inclusions) {
    return DaysSetConverter.calculateDate(this, [days, [1,2,3,4,5], exclusions, inclusions]);
  };

  /**
   * Calculates how many calendar days within {workdays}
   * For example 4 workdays from Wed 19 Aug 2015 is 6 calendar days
   * workdays set is Mon-Fri, please use setWeekdaysToCalendarDays if you have a different set
   */
  moment.fn.workdaysToCalendarDays = function(days, exclusions, inclusions) {
    var date = DaysSetConverter.calculateDate(this, [days, [1,2,3,4,5], exclusions, inclusions]);
    return date.diff(this,'days');
  };

  moment.fn.addWeekdaysFromSet = function() {
    return DaysSetConverter.calculateDate(this, arguments);
  };

  moment.fn.weekdaysFromSetToCalendarDays = function() {
    var date = DaysSetConverter.calculateDate(this, arguments);
    return date.diff(this,'days');
  };

  moment.fn.isoAddWeekdaysFromSet = function() {
    return DaysSetConverter.calculateDate(this, arguments, true);
  };

  moment.fn.isoWeekdaysFromSetToCalendarDays = function() {
    var date = DaysSetConverter.calculateDate(this, arguments, true);
    return date.diff(this,'days');
  };

  moment.fn.dateRangeToDates = function() {
    return WeekDayCalc.dateRangeToDates(this, arguments);
  };

  moment.fn.dateRangeToDatesIso = function() {
    return WeekDayCalc.dateRangeToDates(this, arguments, true);
  };

  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = WeekDayCalc :
    typeof define === 'function' && define.amd ? define(WeekDayCalc) :
      this.WeekDayCalc = WeekDayCalc;

})(moment);