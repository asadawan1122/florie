// export const domain = 'https://florieapp.herokuapp.com'
export const domain = 'http://80.85.84.141'
export const baseURL = `${domain}/api/`
export const imagePath = `${domain}/uploads/`
export const graphBaseURL = 'https://api.coingecko.com/api/v3/coins/'


export const api = {
  login: 'user/login',
  signup: 'user/signup',
  resendOtp: 'user/resend-email-verify-otp',
  updateProfile: 'user/update-profile/',
  forgetPassword: 'user/forgotpassword',
  updatePassword: 'user/forgotpassword/changepassword',
  activateAccount: 'user/verify-email-register',
  getUserDetail: 'user/get-user/',
  getUserImage: 'user/get-profile-image/',
  updateNotification: 'user/enable-disable-email-notifications/',
  update2FA: 'user/enable-two-factor/',
  verify2FA: 'user/verify-two-factor',
  dashboardStats: 'user/dashboardStats/',
  dashboardProjects:'admin/data-management/getAllCompanyProjectStats/',
  addCryptoAddress:'user/create/cryptoAddress/',
  getAllUserCryptoAddress:'user/getUser/cryptoAddress/',
  deleteCryptoAddress:'user/delete/cryptoAddress/',
  plans:'user/getAllPlans/',
  selectPlan:'user/selectplan/',
  getAllHistory:'transactions/histroy/',
  getAllData:'admin/data-management/getAllData/',
  getUserReferrals:'refereral/getRefererals/',
  getUserReferralStats:'admin/level-commission/getUserReferralStatistics/',
  getAllSentTransfers:'usertouser/get-send-transfers/',
  getAllReceivedTransfers:'usertouser/get-receive-transfers/',
  depositBalanceFromReference:'user/transfer-from-ref-to-deposit/',
  depositBalanceFromProfit:'user/transfer-from-profit-to-deposit/',
  depositAmountWithPaypal:'transactions/paypal-deposit/',
  userToUserTransfer:'usertouser/post-transfer',
  redeemInvestment:'user/redeemPlan/',
  notifications:'user/get-notifications/',
  depositAmountWithStripe:'transactions/deposit/',
  generateReferenceCodeForDeposit:'user/generate-reference-code',
  depositAmountWithCryptoExchange:'transactions/deposit-manual/',
  getAllCryptoAddress:'user/getAll/cryptoAddress/',
  getAllCryptoGateway:'admin/deposit-gateway/all-for-user/',
  withdraw:'transactions/withdraw/',
  submitKycDocument:'user/submit-kyc-info/',
  uploadProfilePhoto:'user/upload-profile-picture/',
  getSupportTickets:'support-ticket/user-tickets/',
  submitTicket:'support-ticket/submit-ticket/',
  deleteTicket:'support-ticket/delete-ticket/',
  faqs:'faq/get-faqs',
  getMessagesAgainstTicket:'support-ticket/ticket-details/',
  sendMessage:'support-ticket/send-message/',

  getAllPortfolioHealths:'admin/data-management/getAllPortfolioHealths/',
  getAllInnovations:'admin/data-management/getAllInnovations/',
  getAllCompanyProjectStats:'admin/data-management/getAllCompanyProjectStats/',

  investmentHistory:'user/runningInvestments/',
  interestHistory:'transactions/interestHistory/',
  inlineHistory:'transactions/inlineHistory/',
  depositHistory:'transactions/depositHistory/',
  withdrawHistory:'transactions/withdrawalHistory/',
  transactionHistory:'transactions/transactionsHistory/',

  //graph endpoints
  bitcoin:'bitcoin',
  ethereum:'ethereum',
  binance:'binancecoin',
  tether:'tether',
  solana:'solana',

  
  
}
