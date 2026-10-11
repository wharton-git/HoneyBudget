export type Language = 'fr' | 'en';

export interface Translations {
  // Navigation & General
  'app.name': string;
  'app.tagline': string;
  'nav.dashboard': string;
  'nav.accounts': string;
  'nav.transactions': string;
  'nav.categories': string;
  'nav.reports': string;
  'nav.settings': string;
  'common.cancel': string;
  'common.confirm': string;
  'common.save': string;
  'common.delete': string;
  'common.edit': string;
  'common.add': string;
  'common.all': string;
  'common.loading': string;
  'common.success': string;
  'common.error': string;
  'common.offline': string;
  'common.close': string;

  // Dashboard
  'dashboard.total_balance': string;
  'dashboard.monthly_income': string;
  'dashboard.monthly_expense': string;
  'dashboard.monthly_savings': string;
  'dashboard.my_accounts': string;
  'dashboard.recent_transactions': string;
  'dashboard.no_transactions': string;
  'dashboard.view_all': string;
  'dashboard.quick_add': string;
  'dashboard.expense_by_category': string;
  'dashboard.greeting': string;
  'dashboard.mascot_tip': string;

  // Accounts
  'accounts.title': string;
  'accounts.new_account': string;
  'accounts.edit_account': string;
  'accounts.name': string;
  'accounts.type': string;
  'accounts.currency': string;
  'accounts.initial_balance': string;
  'accounts.current_balance': string;
  'accounts.converted_in': string;
  'accounts.type.checking': string;
  'accounts.type.savings': string;
  'accounts.type.cash': string;
  'accounts.transfer': string;
  'accounts.transfer_title': string;
  'accounts.from_account': string;
  'accounts.to_account': string;
  'accounts.delete_confirm': string;
  'accounts.convert_transactions_tip': string;

  // Transactions
  'tx.title': string;
  'tx.new': string;
  'tx.edit': string;
  'tx.type': string;
  'tx.type.expense': string;
  'tx.type.income': string;
  'tx.type.transfer': string;
  'tx.amount': string;
  'tx.account': string;
  'tx.category': string;
  'tx.date': string;
  'tx.label': string;
  'tx.notes': string;
  'tx.filter_all': string;
  'tx.search_placeholder': string;
  'tx.empty': string;
  'tx.converted_preview': string;

  // Categories & Budgets
  'cat.title': string;
  'cat.new_category': string;
  'cat.budget_limit': string;
  'cat.spent_this_month': string;
  'cat.remaining': string;
  'cat.over_budget': string;
  'cat.food': string;
  'cat.home': string;
  'cat.transport': string;
  'cat.leisure': string;
  'cat.health': string;
  'cat.gift': string;
  'cat.salary': string;
  'cat.other': string;

  // Currencies & Exchange
  'currency.title': string;
  'currency.base_currency': string;
  'currency.exchange_rates': string;
  'currency.refresh_rates': string;
  'currency.rate_info': string;
  'currency.last_updated': string;
  'currency.offline_warning': string;

  // Backup & Google Drive
  'backup.title': string;
  'backup.desc': string;
  'backup.drive_sync': string;
  'backup.drive_zero_gcp': string;
  'backup.desktop_instruction': string;
  'backup.mobile_instruction': string;
  'backup.export_now': string;
  'backup.import_now': string;
  'backup.save_to_drive': string;
  'backup.restore_from_drive': string;
  'backup.encryption_title': string;
  'backup.encryption_desc': string;
  'backup.passphrase': string;
  'backup.passphrase_placeholder': string;
  'backup.success': string;
  'backup.restore_success': string;
  'backup.invalid_file': string;

  // Settings
  'settings.title': string;
  'settings.language': string;
  'settings.currency_settings': string;
  'settings.backup_settings': string;
  'settings.about_title': string;
  'settings.about_desc': string;
  'settings.convert_budgets': string;
  'settings.budgets_converted_success': string;

  // Reports
  'reports.title': string;
  'reports.subtitle': string;
  'reports.month_selector': string;
  'reports.all_months': string;
  'reports.income': string;
  'reports.expense': string;
  'reports.savings': string;
  'reports.savings_rate': string;
  'reports.daily_average': string;
  'reports.operations_count': string;
  'reports.monthly_evolution': string;
  'reports.category_breakdown': string;
  'reports.daily_trend': string;
  'reports.accounts_flow': string;
  'reports.no_data': string;
  'reports.mascot_tip_positive': string;
  'reports.mascot_tip_deficit': string;
}

