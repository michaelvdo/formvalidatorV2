/*

Form validator plugin

author: Michael van den Oudenalder
version: 0.0.1

Basic client-side form validator for use in simple applications.

Usage:
On focusout of a specified field, the formvalidation will run. On submit of the form, only all required fields will be checked

Data-attributes:
** used for targeting the correct form
data-validate-form

** used for validating differend kinds of input fields
data-validate-type="{phone, email, date}"

** used for validating a required field
data-validate-required

*/

;(function($, formValidator) {

  'use strict';

  $.fn.formValidator = function(options) {

    // settings
    var settings = $.extend({
      text: 'texttekst'
    }, options);

    // vars
    var $validateForm = $('[data-validate-form]'),
        $validateType = $('[data-validate-type]'),
        $validateRequired = $('[data-validate-required]');

    // init function
    var init = function() {
      addEventHandlers();
    };

    // event handler function
    var addEventHandlers = function() {
      $validateForm.on('submit', function(e) {
        validateRequired(e, this);
      });
      $validateType.on('focusout', validateField);
    };

    // other functions
    var validateField = function() {
      switch ($(this).data('validate-type')) {
        case 'phone':
          phoneVerification(this);
          break;
        case 'email':
          emailVerification(this);
          break;
        case 'date':
          dateVerification(this);
          break;
      }
    };

    //********************
    // Email verification
    //********************

    var emailVerification = function(element) {
      var $element = $(element);

      if ($element.val() === '') {
        setDataAttribute(element, 'type');
      } else if (isValidEmailAddress($element.val())) {
          setDataAttribute(element, 'type', 'success');
      } else {
        setDataAttribute(element, 'type', 'fail');
      }
    };

    var isValidEmailAddress = function(emailAddress) {
        var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
        return pattern.test(emailAddress);
    };

    //********************
    // Date verification
    //********************

    var dateVerification = function(element) {
      var $element = $(element);

      if ($element.val() === '') {
        setDataAttribute(element, 'type');
      } else if (isValidDate($element.val())) {
          setDataAttribute(element, 'type', 'success');
      } else {
        setDataAttribute(element, 'type', 'fail');
      }
    };

    var isValidDate = function(date) {
        var pattern = new RegExp(/^\s*((31([-/])((0?[13578])|(1[02]))\3(\d\d)?\d\d)|((([012]?[1-9])|([123]0))([-/])((0?[13-9])|(1[0-2]))\12(\d\d)?\d\d)|(((2[0-8])|(1[0-9])|(0?[1-9]))([-/])0?2\22(\d\d)?\d\d)|(29([-/])0?2\25(((\d\d)?(([2468][048])|([13579][26])|(0[48])))|((([02468][048])|([13579][26]))00))))\s*$/);
        return pattern.test(date);
    };

    //********************
    // Telephone number verification
    //********************

    function phoneVerification(element) {
      var $element = $(element);

      if ($element.val() === '') {
        setDataAttribute(element, 'type');
      } else if ($.isNumeric($element.val()) && $element.val().length === 10) {
          setDataAttribute(element, 'type', 'success');
      } else {
        setDataAttribute(element, 'type', 'fail');
      }
    }

    //********************
    // Required verification
    //********************

    var validateRequired = function(e, form) {
      e.preventDefault();
      var allRequiredFieldsFilledIn = true;

      // check all required fields for content
      $validateRequired.each(function() {
        var $this = $(this);
        if ($.trim($(this).val()) === '') {
          setDataAttribute(this, 'required', 'fail');
          allRequiredFieldsFilledIn = false;
        } else {
          setDataAttribute(this, 'required', 'success');
        }
      });

      if (allRequiredFieldsFilledIn) {
        form.submit();
      }
    };

    //********************
    // Set data-* attribute
    //********************

    var setDataAttribute = function(element, check, pass) {
      var key = '';
      if (pass !== undefined) {
        key =  pass;
      }
      $(element).attr('data-validate-' + check + '-check', key);
    };

    //********************
    // End set data-* attribute
    //********************

    // run init function on document ready
    $(function() {
      init();
    });

  };

  $(function() {
    $(window).formValidator({text: 'test 2'});
  });

})(jQuery);