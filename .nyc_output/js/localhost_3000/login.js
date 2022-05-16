
      function msieversion() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');

        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
          // If Internet Explorer, return version number
          alert(
            'IE is not supported, please use the latest Chrome, Firefox or Edge',
          );
        } // If another browser, return 0
        return false;
      }
      msieversion();
    