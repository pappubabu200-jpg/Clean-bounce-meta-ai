package billing

import (
	"github.com/stripe/stripe-go/v76"
	"github.com/stripe/stripe-go/v76/checkout/session"
	"github.com/stripe/stripe-go/v76/webhook"
)

func Init(key string) {
	stripe.Key = key
}

func CreateCheckoutSession(userID, priceID, successURL, cancelURL string) (*stripe.CheckoutSession, error) {
	params := &stripe.CheckoutSessionParams{
		Mode: stripe.String(string(stripe.CheckoutSessionModeSubscription)),
		CustomerEmail: stripe.String(userID),
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{Price: stripe.String(priceID), Quantity: stripe.Int64(1)},
		},
		SuccessURL: stripe.String(successURL),
		CancelURL: stripe.String(cancelURL),
		Metadata: map[string]string{"user_id": userID},
	}
	return session.New(params)
}

func VerifyWebhook(payload []byte, sigHeader, secret string) (stripe.Event, error) {
	return webhook.ConstructEvent(payload, sigHeader, secret)
}
