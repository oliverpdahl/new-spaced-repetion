Rails.application.routes.draw do
  resources :memories do
    resources :recall_events
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
