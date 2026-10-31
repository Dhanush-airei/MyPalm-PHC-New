export class API_ENDPOINTS {
  public static MILL_AUTH = 'http://185.93.167.15:9110/mill_auth';

  public static checkbuttonflag = 'https://mjm.mypalm.com.my/Login_check';

  public static login = 'login';

  public static user_manual_list = 'user_manual_list';

  public static change_password = 'change_password';

  public static deleteaccount = 'user_delete';

  public static supplerlist = 'dealer_suppiler_list';

  public static vehiclelist = 'vehicle_list';

  public static generic_image_upload = 'generic_image_upload';

  public static savegrading = 'insert_grading';

  public static gradingvehiclelist = 'get_grading_list';

  public static gradingreport = 'get_grading_report';

  public static getpendinggradinglist = 'get_pending_grading_list';

  public static updategradingnetweight = 'update_grading_netweight';

  public static getweighbridgereport = 'get_grading_netweight_report';

  public static getsterilizerstationalertdata =
    'get_sterilizer_performance_popup';

  public static getpressingstationalertdata =
    'get_pressing_station_performance_popup';

  public static getdooroopenlaterdata = 'get_sterilizer_performance_list';

  public static getsterilizersensordata =
    'get_sterilizer_performance_sensor_data_list';

  public static savedooropenlater = 'update_sterilizer_performance_door_time';

  public static getcycleno = 'get_cycleno';

  public static getsterilizers = 'get_sterilizer';

  public static get_sterilizer_cycles_data =
    'get_sterilizer_performance_cycle_data';

  public static getsettings = 'get_imagesetting_flag';

  public static getsterilizerdooropentime = 'get_sterilizer_last_dooropentime';

  public static get_sterilizer_cycles = 'get_sterilizer_cycles';

  public static savehourlysterilizerstation = 'insert_sterilizer_performance';

  public static getmaintenancependingcount = 'get_bell_count';

  public static alertnotification = 'alert_notification_view';

  public static segregatenotification = 'maintenance_notification_view_new';

  public static updatealertnotification = 'update_alert_notification';

  public static deletedashboardnotification = 'update_notification_view';

  public static alertdetailsnotification = 'get_alert_notification_details';

  public static get_sterilizer_hourly_performance_new =
    'sterilizer_performance_report_new';

  public static get_pressstation_performance_new =
    'pressing_station_performance_report_new';

  public static getpressingstationstatus = 'get_production_hourly_status';

  public static getpercentagevalue = 'get_percentage_value';

  public static getdigestordrainpipevalue = 'get_digestordrainpipevalue';

  public static getfiberflowvalue = 'get_grade_value';

  public static get_oilloss_prediction = 'get_oilloss_prediction';

  public static ownerproductiondata = 'alert_notification_list';

  public static getproductionalertsummary = 'production_alert_summary';

  public static ownermaintenancedata = 'get_maintenance_count';

  public static oillosses_report_list = 'get_oil_loss_prediction_list';

  public static getdailylaboillosslist = 'get_daily_lab_oil_loss_list';

  public static getmonthlylaboillosslist = 'get_monthwise_lab_average';

  public static get_incharge_person_list = 'assigned_person_list_cm';

  public static getmaintenancenotificationlistreport =
    'maintanence_notification_report';

  public static getmaintenancenotificationview =
    'get_maintanence_notification_view';

  public static getmultipartdefectviewlist =
    'get_maintanence_notification_parts_details';

  public static getparttasklistflag = 'check_maintenance_notification_tasklist';

  public static getparttasklist = 'get_task_details';

  public static getpredictivereport =
    'get_predictive_maintanence_notification_report';

  public static getpredictiverejectreport =
    'get_rejected_predictive_maintanence_notification_report';

  public static stationlist = 'stationlist';

  public static getmachineriesrunninghours =
    'machineries_running_hours_report_new';

  public static machinelist = 'locationlist';

  public static machine_runninghours_list = 'get_parts_list_report';

  public static getlaboillosses = 'get_labdata_report';

  public static CPO_stock_report = 'CPO_stock_report';

  public static PKO_stock_report = 'PKO_stock_report';

  public static get_priority_level = 'getPriorityLevel';

  public static get_pklist_data = 'get_pk_stock_report';

  public static getsupplychain = 'supplier_chain';

  public static getsuppliersupplychain = 'suppChain_supplier_list';

  public static getsuppliersupplychaincount = 'suppChain_supplier_listcount';

  public static getsupplierPolygon = 'supplierPolygon';

  public static savelaboillosses = 'insert_lab_data';

  public static save_cpostock_data = 'insert_cpo_stock_save';

  public static insert_pko_stock_save = 'insert_pko_stock_save';

  public static save_pkstock_data = 'insert_pk_stock_save';

  public static getproductionstartstopstatus = 'get_production_status';

  public static getproductionstations = 'production_dashboard_new';

  public static savestartstopproductionstation =
    'update_production_station_status';

  public static saveallffbcages = 'save_ffbcages';

  public static savestartstopproduction = 'update_production_status';

  public static savebreakdownstatus = 'production_breakdown_save';

  public static savemachinestatus = 'update_production_machinery_status';

  public static breakdowncodinglist = 'get_breakdown_coding';

  public static maintenancetypelist = 'get_maintanence_type';

  public static breakdowncauseslist = 'get_breakdown_cause';

  public static sequencenumber = 'get_work_order_sequence';

  public static savemaintenancenotification =
    'maintenance_notification_save_new';

  public static savemultiplemaintenancenotification =
    'maintenance_notification_multiple_part_save';

  public static getmaintenancenotificationlist =
    'get_maintanence_notification_list_new';

  public static activitylist = 'get_activity';

  public static carryoutbylist = 'get_led_users';

  public static partslist = 'parts_list';

  public static workassignedtolist = 'get_workassignto_list';

  public static getPriorityLevel = 'getPriorityLevel';

  public static getsummarypopupflag = 'get_previous_day_popup_flag';

  public static getsummarypopup = 'get_previous_day_popup_details';

  public static updatesummary = 'insert_popup_acknowlegement';

  public static getainotificationlist = 'get_ai_maintanence_notification_list';

  public static saveaiassign = 'create_predictive_maintanence';

  public static saveaireject = 'reject_ai_prediction';

  public static getainotificationview =
    'get_predictive_maintanence_activity_text';

  public static savemanagerassign = 'maintenance_notification_assignedto';

  public static damagelist = 'get_damage';

  public static assignedtolist = 'get_assignto_list';

  public static getmultipartdefectlist = 'get_partdefect_list';

  public static gettaskdetails = 'get_task_details';

  public static formancorrectivemaintenanceverify =
    'maintenance_notification_foreman_verify';

  public static maintenance_notification_engineer_deny =
    'maintenance_notification_engineer_deny';

  public static updatecorrectivemaintenanceauthorize =
    'maintenance_notification_engineer_authorize';

  public static uploadnotificationimages =
    'maintenance_notification_images_save';

  public static getpartsdetails = 'get_parts_details';

  public static get_processlist = 'get_production_data';

  public static save_processdata = 'insert_production_data';

  public static savehourlypressingstation =
    'insert_pressing_station_performance';

  public static getnotificationhistory = 'get_notification_history';

  public static maintenancestatuslist = 'get_maintanence_notification_status';

  public static getnotificationtimeline = 'get_notification_timeline';
}
