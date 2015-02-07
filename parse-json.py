import json
import pprint

if __name__ == "__main__":
	parsed = []
	with open('old-banner.json', 'r') as f:
		s = json.load(f)
		for item in s:
			d = item['description']

			n = {
				'title': item['title'],
				'code': item['name'],
				'prereqs': []
			}
			parsed.append(n)
	with open('parsed-json.json', 'w') as f:
                pprint.pprint(parsed, f)

