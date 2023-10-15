from random import random
import requests
import phonetics
from difflib import SequenceMatcher
from colorama import init, Fore
import concurrent.futures

RISKY_TLDS = ['xyz', 'top', 'club', 'gdn', 'loan', 'win', 'vip', 'online', 'wang', 'bid', 'link', 'in', 'us', 'gov']

def sanitize(domain):
    """Remove non-letter characters."""
    return ''.join(filter(str.isalpha, domain))

def get_phonetic_representation(domain):
    sanitized_domain = sanitize(domain)
    return phonetics.soundex(sanitized_domain)

def is_phonetically_similar(domain1, domain2):
    match = SequenceMatcher(None, get_phonetic_representation(domain1), get_phonetic_representation(domain2))
    return match.ratio()

def is_visually_similar(domain1, domain2):
    common_chars = set(domain1).intersection(set(domain2))
    proportion_matched = len(common_chars) / len(domain1)
    return proportion_matched > 0.7

def is_high_risk_tld(domain):
    tld = domain.split('.')[-1]
    return tld in RISKY_TLDS

def is_domain_active(domain):
    try:
        response = requests.get("http://" + domain, timeout=5)
        if (response.status_code == 200):
             return True
        response = requests.get("https://" + domain, timeout=5)
        if (response.status_code == 200):
             return True
         
    except:
        return False

def get_number_of_domains():
    while True:
        try:
            count = int(input("How many impersonating domains do you want to check? "))
            if count > 0:
                return count
            else:
                print(Fore.RED + "Please enter a positive number.")
        except ValueError:
            print(Fore.RED + "Invalid input. Please enter a valid number.")

def check_domain_info(domain, main_domain):
    phonetic_match_ratio = is_phonetically_similar(main_domain, domain)
    visual_match = is_visually_similar(main_domain, domain)
    domain_activity = is_domain_active(domain)
    high_risk_tld = is_high_risk_tld(domain)
    
    return {
        "domain": domain,
        "phonetic_ratio": phonetic_match_ratio,
        "visual_match": visual_match,
        "active": domain_activity,
        "high_risk_tld": high_risk_tld
    }

def generate_impersonating_domains(domain, count=5):
    substitutions = {
        'a': ['4', '8', '@'],
        'o': ['0', '()'],
        'l': ['1', 'i', '|'],
        'e': ['3', '&'],
        's': ['5', '$'],
        'g': ['9', '&'],
        't': ['+', '7']
    }
    generated_domains = set()

    # Character substitutions (multiple substitutions per character)
    for i in range(len(domain)):
        for char, subs in substitutions.items():
            for sub in subs:
                generated_domains.add(domain[:i] + sub + domain[i+1:])

    # Double characters
    for i in range(len(domain)):
        if domain[i].isalpha():
            generated_domains.add(domain[:i] + domain[i] + domain[i:])

    # Character deletions
    for i in range(len(domain)):
        generated_domains.add(domain[:i] + domain[i + 1:])

    # TLD swaps
    extensions = ['.com', '.net', '.org', '.co', '.in', '.info', '.biz', '.online']
    main_name, ext = domain.rsplit('.', 1)
    for new_ext in extensions:
        if new_ext != f".{ext}":
            generated_domains.add(main_name + new_ext)

    while len(generated_domains) < count:
        random_domain = ''.join(random.choice(domain) for _ in domain)
        generated_domains.add(random_domain)

    return list(generated_domains)[:count]

def batch_process_domains(main_domain, domains_batch, counters):
    results = []
    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = [executor.submit(check_domain_info, domain, main_domain) for domain in domains_batch]
        for future in concurrent.futures.as_completed(futures):
            domain_info = future.result()
            results.append(domain_info)
            print_results(domain_info, main_domain, counters)  # passing the counters here
    return results


# ... [rest of the code]

def print_results(info, main_domain, counters):
    print(Fore.GREEN + f"Domain: {info['domain']}")
    print(Fore.CYAN + f"Phonetic similarity ratio to {main_domain}: {info['phonetic_ratio']:.2f}")
    print(Fore.CYAN + f"Visually similar to {main_domain}: {'Yes' if info['visual_match'] else 'No'}")

    activity_color = Fore.RED if info['active'] else Fore.BLUE
    print(activity_color + f"Domain is active: {'Yes' if info['active'] else 'No'}")

    tld_risk_color = Fore.RED if info['high_risk_tld'] else Fore.BLUE
    print(tld_risk_color + f"Has high-risk TLD: {'Yes' if info['high_risk_tld'] else 'No'}")
    
    print("-" * 40)

    # Update counters
    if info['active']:
        counters['active'] += 1
    if info['high_risk_tld']:
        counters['high_risk_tld'] += 1
    if info['active'] and info['high_risk_tld']:
        counters['both'] += 1

def main():
    init(autoreset=True)

    main_domain = input("Enter the main domain: ")
    num_domains = get_number_of_domains()
    potential_domains = generate_impersonating_domains(main_domain, num_domains)

    print("\n" + Fore.CYAN + "Generated Impersonating Domains:\n")
    for domain in potential_domains:
        print(Fore.YELLOW + domain)
    print("-" * 40)

    # Initializing counters
    counters = {
        "active": 0,
        "high_risk_tld": 0,
        "both": 0
    }

    batch_size = 5
    for i in range(0, len(potential_domains), batch_size):
        domains_batch = potential_domains[i:i+batch_size]
        batch_process_domains(main_domain, domains_batch, counters)

    # Printing the summary
    print(Fore.BLUE + "\nSummary:")
    print(Fore.MAGENTA + f"Total high-risk TLD domains: {counters['high_risk_tld']}")
    print(Fore.YELLOW + f"Total active domains: {counters['active']}")
    print(Fore.RED + f"Total domains that are both active and have high-risk TLD: {counters['both']}")

if __name__ == "__main__":
    main()

