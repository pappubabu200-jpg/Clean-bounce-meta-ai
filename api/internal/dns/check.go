package dns

import (
	"net"
	"strings"
)

type DNSResult struct {
	Domain string `json:"domain"`
	SPF string `json:"spf"`
	DKIM bool `json:"dkim"`
	DMARC string `json:"dmarc"`
	MX []string `json:"mx"`
}

func Check(domain string) DNSResult {
	res := DNSResult{Domain: domain}
	
	// MX
	mxRecords, _ := net.LookupMX(domain)
	for _, mx := range mxRecords {
		res.MX = append(res.MX, mx.Host)
	}
	
	// SPF
	txtRecords, _ := net.LookupTXT(domain)
	for _, txt := range txtRecords {
		if strings.HasPrefix(txt, "v=spf1") {
			res.SPF = txt
			break
		}
	}
	
	// DMARC
	dmarcRecords, _ := net.LookupTXT("_dmarc." + domain)
	for _, txt := range dmarcRecords {
		if strings.HasPrefix(txt, "v=DMARC1") {
			res.DMARC = txt
			break
		}
	}
	
	// DKIM - check common selectors
	selectors := []string{"default", "google", "k1", "selector1", "selector2"}
	for _, s := range selectors {
		txt, _ := net.LookupTXT(s + "._domainkey." + domain)
		if len(txt) > 0 {
			res.DKIM = true
			break
		}
	}
	
	return res
}
