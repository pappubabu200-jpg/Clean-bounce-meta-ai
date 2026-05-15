package smtp

import (
	"context"
	"fmt"
	"net"
	"net/smtp"
	"strings"
	"time"
)

type Result struct {
	Email string `json:"email"`
	Syntax bool `json:"syntax"`
	MX bool `json:"mx"`
	SMTP bool `json:"smtp"`
	Disposable bool `json:"disposable"`
	Valid bool `json:"valid"`
	Reason string `json:"reason"`
}

var disposableDomains = map[string]bool{
	"mailinator.com": true, "10minutemail.com": true, "guerrillamail.com": true,
}

func Verify(email string) Result {
	res := Result{Email: email}
	
	parts := strings.Split(email, "@")
	if len(parts)!= 2 {
		res.Reason = "invalid_syntax"
		return res
	}
	res.Syntax = true
	domain := parts[1]
	
	if disposableDomains[domain] {
		res.Disposable = true
		res.Reason = "disposable"
		return res
	}
	
	// MX Check
	mxRecords, err := net.LookupMX(domain)
	if err!= nil || len(mxRecords) == 0 {
		res.Reason = "no_mx"
		return res
	}
	res.MX = true
	
	// SMTP Check - connect to first MX
	mx := mxRecords[0].Host
	conn, err := net.DialTimeout("tcp", mx+":25", 5*time.Second)
	if err!= nil {
		res.Reason = "mx_timeout"
		return res
	}
	defer conn.Close()
	
	client, err := smtp.NewClient(conn, mx)
	if err!= nil {
		res.Reason = "smtp_fail"
		return res
	}
	defer client.Close()
	
	client.Hello("cleanbounce.com")
	client.Mail("verify@cleanbounce.com")
	err = client.Rcpt(email)
	if err!= nil {
		res.Reason = "mailbox_not_found"
		return res
	}
	
	res.SMTP = true
	res.Valid = true
	res.Reason = "valid"
	return res
}
