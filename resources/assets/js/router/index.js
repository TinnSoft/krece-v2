import { authGuard, guestGuard } from '../utils/router'

export default [
  //{ path: '/', name: 'welcome', component: require('../views/welcome.vue') },

  ...authGuard([
    { path: '/', name: 'home', component: require('../views/home.vue') },
    { path: '/estimate', name: 'estimate_index', name: 'estimate', component: require('../views/estimate/index.vue') },
    { path: '/estimate/create', name: 'form', component: require('../views/estimate/form.vue') },
    { path: '/estimate/:id/edit', component: require('../views/estimate/form.vue'), meta: { mode: 'edit' } },
    { path: '/estimate/:id/clone', component: require('../views/estimate/form.vue'), meta: { mode: 'clone' } },
    { path: '/estimate/:id', name: 'show', component: require('../views/estimate/show.vue') },

    { path: '/remision', name: 'remision_index', component: require('../views/remision/index.vue') },
    { path: '/remision/create', name: 'remision_form', component: require('../views/remision/form.vue') },
    { path: '/remision/:id/edit', component: require('../views/remision/form.vue'), meta: { mode: 'edit' } },
    { path: '/remision/:id/clone', component: require('../views/remision/form.vue'), meta: { mode: 'clone' } },
    { path: '/remision/:id', name: 'remision_show', component: require('../views/remision/show.vue') },

    { path: '/credit-note', name: 'credit-note_index', component: require('../views/credit-note/index.vue') },
    { path: '/credit-note/create', name: 'credit-note_form', component: require('../views/credit-note/form.vue') },
    { path: '/credit-note/:id/edit', component: require('../views/credit-note/form.vue'), meta: { mode: 'edit' } },
    { path: '/credit-note/:id', name: 'credit-note_show', component: require('../views/credit-note/show.vue') },

    { path: '/payment-in', name: 'payment-in_index', component: require('../views/payment-in/index.vue') },
    { path: '/payment-in/create', name: 'payment-in_form', component: require('../views/payment-in/form.vue') },
    { path: '/payment-in/:id/edit', component: require('../views/payment-in/form.vue'), meta: { mode: 'edit' } },
    { path: '/payment-in/:id', name: 'payment-in_show', component: require('../views/payment-in/show.vue') },

    { path: '/invoice', name: 'invoice_index', component: require('../views/invoice/index.vue') },
    { path: '/invoice/create', name: 'invoice_form', component: require('../views/invoice/form.vue') },
    { path: '/invoice/:id/edit', component: require('../views/invoice/form.vue'), meta: { mode: 'edit' } },
    { path: '/invoice/:id/clone', component: require('../views/invoice/form.vue'), meta: { mode: 'clone' } },
    { path: '/invoice/:id', name: 'invoice_show', component: require('../views/invoice/show.vue') },

    { path: '/bill', name: 'bill_index', component: require('../views/bill/index.vue') },
    { path: '/bill/create', name: 'bill_form', component: require('../views/bill/form.vue') },
    { path: '/bill/:id/edit', component: require('../views/bill/form.vue'), meta: { mode: 'edit' } },
    { path: '/bill/:id/clone', component: require('../views/bill/form.vue'), meta: { mode: 'clone' } },
    { path: '/bill/:id', name: 'bill_show', component: require('../views/bill/show.vue') },

    { path: '/debit-note', name: 'debit-note_index', component: require('../views/debit-note/index.vue') },
    { path: '/debit-note/create', name: 'debit-note_form', component: require('../views/debit-note/form.vue') },
    { path: '/debit-note/:id/edit', component: require('../views/debit-note/form.vue'), meta: { mode: 'edit' } },
    { path: '/debit-note/:id', name: 'debit-note_show', component: require('../views/debit-note/show.vue') },

    { path: '/purchase-order', name: 'purchase-order_index', component: require('../views/purchase-order/index.vue') },
    { path: '/purchase-order/create', name: 'purchase-order_form', component: require('../views/purchase-order/form.vue') },
    { path: '/purchase-order/:id/edit', component: require('../views/purchase-order/form.vue'), meta: { mode: 'edit' } },
    { path: '/purchase-order/:id/clone', component: require('../views/purchase-order/form.vue'), meta: { mode: 'clone' } },
    { path: '/purchase-order/:id', name: 'purchase-order_show', component: require('../views/purchase-order/show.vue') },

    { path: '/payment-out', name: 'payment-out_index', component: require('../views/payment-out/index.vue') },
    { path: '/payment-out/create', name: 'payment-out_form', component: require('../views/payment-out/form.vue') },
    { path: '/payment-out/:id/edit', component: require('../views/payment-out/form.vue'), meta: { mode: 'edit' } },
    { path: '/payment-out/:id', name: 'payment-out_show', component: require('../views/payment-out/show.vue') },

    { path: '/contact', name: 'contact_index', component: require('../views/contact/index.vue') },
    { path: '/contact/:id', name: 'contact_show', component: require('../views/contact/show.vue') },

    { path: '/inventory', name: 'inventory_index', component: require('../views/inventory/index.vue') },
    { path: '/inventory/:id', name: 'inventory_show', component: require('../views/inventory/show.vue') },

    { path: '/category', name: 'category_index', component: require('../views/category/index.vue') },

    { path: '/bank', name: 'bank_index', component: require('../views/bank/index.vue') },
    { path: '/bank/:id', name: 'bank_show', component: require('../views/bank/show.vue') },

    {
      path: '/settings',
      component: require('../views/settings/index.vue'),
      children: [
        { path: '', redirect: { name: 'settings.company' }},
        { path: 'profile', name: 'settings.profile', component: require('../views/settings/profile.vue') },
        { path: 'company', name: 'settings.company', component: require('../views/settings/company.vue') },
        { path: 'numeration', name: 'settings.numeration', component: require('../views/settings/numeration.vue') },
        { path: 'payment_terms', name: 'settings.payment_terms', component: require('../views/settings/payment_terms.vue') },
        { path: 'retention', name: 'settings.retention', component: require('../views/settings/retention.vue') },
        { path: 'taxes', name: 'settings.taxes', component: require('../views/settings/taxes.vue') }
      ]
    },

  ]),

  ...guestGuard([
    { path: '/login', name: 'auth.login', component: require('../views/auth/login.vue') },
    { path: '/register', name: 'auth.register', component: require('../views/auth/register.vue') },
    { path: '/password/reset', name: 'password.request', component: require('../views/auth/password/email.vue') },
    { path: '/password/reset/:token', name: 'password.reset', component: require('../views/auth/password/reset.vue') }
  ]),

  { path: '*', component: require('../views/errors/404.vue') }
]
