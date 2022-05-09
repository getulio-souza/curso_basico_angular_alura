let $/* : JQueryStatic */ = (window as any)["jQuery"];

export var BootstrapDropdownHelper = {

  show(dropdownId: string) {
    $('#' + dropdownId).dropdown('show');
  },

  hide(dropdownId: string) {
    $('#' + dropdownId).dropdown('hide');
    $('#' + dropdownId).dropdown('dispose');
  },

}