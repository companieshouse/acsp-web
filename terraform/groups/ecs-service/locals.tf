# Define all hardcoded local variable and local variables looked up from data resources
locals {
  stack_name                 = "identity" # this must match the stack name the service deploys into
  name_prefix                = "${local.stack_name}-${var.environment}"
  global_prefix              = "global-${var.environment}"
  service_name               = "acsp-web"
  container_port             = "3000" # default Node port to match start script
  docker_repo                = "acsp-web"
  lb_listener_rule_priority  = 18
  lb_listener_paths          = ["/acsp-web/*"]
  healthcheck_path           = "/acsp-web" #healthcheck path for accounts association service
  healthcheck_matcher        = "200"
  application_subnet_ids     = data.aws_subnets.application.ids
  kms_alias                  = "alias/${var.aws_profile}/environment-services-kms"
  service_secrets            = jsondecode(data.vault_generic_secret.service_secrets.data_json)
  stack_secrets              = jsondecode(data.vault_generic_secret.stack_secrets.data_json)
  application_subnet_pattern = local.stack_secrets["application_subnet_pattern"]
  use_set_environment_files  = var.use_set_environment_files
  s3_config_bucket           = data.vault_generic_secret.shared_s3.data["config_bucket_name"]
  app_environment_filename   = "acsp-web.env"
  parameter_store_secrets    = {
    "account_url"               = local.service_secrets["account_url"]
    "alphabetical_search_url"   = local.service_secrets["alphabetical_search_url"]
    "api_url"                   = local.service_secrets["api_url"]
    "vpc_name"                  = local.vpc_name
    "chs_api_key"               = local.service_secrets["chs_api_key"]
    "chs_internal_api_key"      = local.service_secrets["chs_internal_api_key"]
    "internal_api_url"          = local.service_secrets["internal_api_url"]
    "cdn_host"                  = local.service_secrets["cdn_host"]
    "oauth2_auth_uri"           = local.service_secrets["oauth2_auth_uri"]
    "oauth2_redirect_uri"       = local.service_secrets["oauth2_redirect_uri"]
    "account_url"               = local.service_secrets["account_url"]
    "cache_server"              = local.service_secrets["cache_server"]
    "chs_url"                   = local.service_secrets["chs_url"]
    "chs_monitor_gui_url"       = local.service_secrets["chs_monitor_gui_url"]
    "cookie_domain"             = local.service_secrets["cookie_domain"]
    "cookie_secret"             = local.service_secrets["cookie_secret"]
    "cdn_host"                  = local.service_secrets["cdn_host"]
  }

  vpc_name                  = local.service_secrets["vpc_name"]
  chs_api_key               = local.service_secrets["chs_api_key"]
  chs_internal_api_key      = local.service_secrets["chs_internal_api_key"]
  internal_api_url          = local.service_secrets["internal_api_url"]
  cdn_host                  = local.service_secrets["cdn_host"]
  oauth2_auth_uri           = local.service_secrets["oauth2_auth_uri"]
  oauth2_redirect_uri       = local.service_secrets["oauth2_redirect_uri"]
  account_url               = local.service_secrets["account_url"]
  cache_server              = local.service_secrets["cache_server"]


  # create a map of secret name => secret arn to pass into ecs service module
  # using the trimprefix function to remove the prefixed path from the secret name
  secrets_arn_map = {
    for sec in data.aws_ssm_parameter.secret:
      trimprefix(sec.name, "/${local.name_prefix}/") => sec.arn
  }

  service_secrets_arn_map = {
    for sec in module.secrets.secrets:
      trimprefix(sec.name, "/${local.service_name}-${var.environment}/") => sec.arn

  }

  task_secrets = [
    { "name" : "ACCOUNT_URL", "valueFrom"               : "${local.service_secrets_arn_map.account_url}" },
    { "name" : "ALPHABETICAL_SEARCH_URL", "valueFrom"   : "${local.service_secrets_arn_map.alphabetical_search_url}" },
    { "name" : "API_URL", "valueFrom"                   : "${local.service_secrets_arn_map.api_url}" },
    { "name" : "CACHE_SERVER", "valueFrom"              : "${local.service_secrets_arn_map.cache_server}" },
    { "name" : "CDN_HOST", "valueFrom"                  : "${local.service_secrets_arn_map.cdn_host}" },
    { "name" : "CHS_API_KEY", "valueFrom"               : "${local.service_secrets_arn_map.chs_api_key}" },
    { "name" : "CHS_MONITOR_GUI_URL", "valueFrom"       : "${local.service_secrets_arn_map.chs_monitor_gui_url}" },
    { "name" : "CHS_URL", "valueFrom"                   : "${local.service_secrets_arn_map.chs_url}" },
    { "name" : "COOKIE_DOMAIN", "valueFrom"             : "${local.service_secrets_arn_map.cookie_domain}" },
    { "name" : "COOKIE_SECRET", "valueFrom"             : "${local.service_secrets_arn_map.cookie_secret}" }
  ]
  global_secret_list = flatten([for key, value in local.global_secrets_arn_map :
    { "name" = upper(key), "valueFrom" = value }
  ])

  global_secrets_arn_map = {
    for sec in data.aws_ssm_parameter.global_secret :
    trimprefix(sec.name, "/${local.global_prefix}/") => sec.arn
  }

  service_secret_list = flatten([for key, value in local.service_secrets_arn_map :
    { "name" = upper(key), "valueFrom" = value }
  ])

  ssm_service_version_map = [
    for sec in module.secrets.secrets : {
      name  = "${replace(upper(local.service_name), "-", "_")}_${var.ssm_version_prefix}${replace(upper(basename(sec.name)), "-", "_")}",
      value = tostring(sec.version)
    }
  ]

  ssm_global_version_map = [
    for sec in data.aws_ssm_parameter.global_secret : {
      name  = "GLOBAL_${var.ssm_version_prefix}${replace(upper(basename(sec.name)), "-", "_")}",
      value = tostring(sec.version)
    }
  ]

  # secrets to go in list
  #  task_secrets = concat(local.global_secret_list, local.service_secret_list, [
  #    { "name" : "COOKIE_SECRET", "valueFrom" : "${local.service_secrets_arn_map.cookie_secret}" },
  #    { "name" : "CHS_DEVELOPER_CLIENT_SECRET", "valueFrom" : "${local.service_secrets_arn_map.chs_developer_client_secret}" },
  #    { "name" : "CHS_DEVELOPER_CLIENT_ID", "valueFrom" : "${local.service_secrets_arn_map.chs_developer_client_id}" },
  #    { "name" : "OAUTH2_REQUEST_KEY", "valueFrom" : "${local.service_secrets_arn_map.oauth2_request_key}" },
  #    { "name" : "DEVELOPER_OAUTH2_REQUEST_KEY", "valueFrom" : "${local.service_secrets_arn_map.developer_oauth2_request_key}" },
  #  ])

  # TODO: task_secrets don't seem to correspond with 'parameter_store_secrets'. What is the difference?
  task_secrets = concat(local.global_secret_list, local.service_secret_list)

  task_environment = concat(local.ssm_global_version_map,local.ssm_service_version_map)

}
