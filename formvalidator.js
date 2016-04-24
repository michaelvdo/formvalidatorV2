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

To-do:

Commenting style:

Goal of the function
@param1 {type} name
@param2 {type} name
@return {type} explanation

*/

;(function($, formValidator) {

  'use strict';

  $.fn.formValidator = function(options) {

    /**
    * Global settings (for each form called)
    */
    var settings = $.extend({}, options);

    return this.each(function() {

      /**
      * Vars
      */
      var $validateForm = $(this),
          $validateType = $validateForm.find('[data-validate-type]'),
          $validateRequired = $validateForm.find('[data-validate-required]'),
          valueTest,
          validateFunctions = {
            email: function(valueTest) {
              return isValidEmailAddress(valueTest);
            },
            date: function(valueTest) {
              return isValidDate(valueTest);
            },
            phone: function(valueTest) {
              return isValidPhoneNumber(valueTest);
            }
          };

      /**
      * Init functions
      */
      function init() {
        addEventHandlers();
      }

      /**
      * Add event handlers
      */
      function addEventHandlers() {
        $validateForm.on('submit', function(e) {
          validateForm(e, this);
        });
        $validateType.on('focusout', function() {
          validateFields([this]);
        });
      }

      /**
      * Validate type field(s)
      * @param1 {array or object} list
      * @return {boolean} field(s) passed validation
      */
      function validateFields(list) {
        var allTypeFieldsSuccess = true;
        $.each(list, function(i, element) {
          var $element = $(element),
              type = $element.data('validate-type'),
              value = $element.val(),
              validEntry = validateFunctions[type](value);

          if (value === '') {
            setDataAttribute(element, 'type');
          } else if (validEntry) {
              setDataAttribute(element, 'type', 'success');
          } else {
            setDataAttribute(element, 'type', 'fail');
            allTypeFieldsSuccess = false;
          }
        });
        return allTypeFieldsSuccess;
      }

      /**
      * Email validator
      * @param1 {string} emailAddress of input field
      * @return {boolean} string passed validation
      */
      function isValidEmailAddress(emailAddress) {
          var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
          return pattern.test(emailAddress);
      }

      /**
      * Date validator
      * @param1 {string} date of input field
      * @return {boolean} string passed validation
      */
      function isValidDate(date) {
          var pattern = new RegExp(/^\s*((31([-/])((0?[13578])|(1[02]))\3(\d\d)?\d\d)|((([012]?[1-9])|([123]0))([-/])((0?[13-9])|(1[0-2]))\12(\d\d)?\d\d)|(((2[0-8])|(1[0-9])|(0?[1-9]))([-/])0?2\22(\d\d)?\d\d)|(29([-/])0?2\25(((\d\d)?(([2468][048])|([13579][26])|(0[48])))|((([02468][048])|([13579][26]))00))))\s*$/);
          return pattern.test(date);
      }

      /**
      * Phone number validator
      * @param1 {string} phone number of input field
      * @return {boolean} string passed validation
      */
      function isValidPhoneNumber(phoneNumber) {
        // https://stackoverflow.com/questions/4338267/validate-phone-number-with-javascript#answer-29767609
        var pattern = new RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
        return pattern.test(phoneNumber);
      }

      /**
      * Required field validator
      * @return {boolean} all required fields have a value
      */
      function validateRequired() {
        var allRequiredFieldsFilledIn = true;

        // check all required fields for content
        $validateRequired.each(function() {
          if ($.trim($(this).val()) === '') {
            setDataAttribute(this, 'required', 'fail');
            allRequiredFieldsFilledIn = false;
          } else {
            setDataAttribute(this, 'required', 'success');
          }
        });

        return allRequiredFieldsFilledIn;
      }

      /**
      * Form validator
      * @param1 {event} e (form submit)
      * @param2 {element} form
      */
      function validateForm(e, form) {
        e.preventDefault();

        if (validateRequired() && validateFields($validateType)) {
          form.submit();
        }
      }

      /**
      * Set data-* attribute
      * @param1 {element} element
      * @param2 {string} check
      * @param3 {string} pass
      */
      function setDataAttribute(element, check, pass) {
        var key = '';
        if (pass !== undefined) {
          key =  pass;
        }
        $(element).attr('data-validate-' + check + '-check', key);
      }

      /**
      * Run init function on document ready
      */
      $(function() {
        init();
      });

    });
  };

  $(function() {
    $('#form').formValidator();
  });

})(jQuery);
