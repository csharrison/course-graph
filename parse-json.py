import json
import pprint

def find_prereqs(description, departments, courses):
	prereqs = 'Prerequisites: '
	recommended = 'Recommended: '
	pidx = description.rfind(prereqs) + len(prereqs)
	ridx = description.rfind(recommended) + len(recommended)

	pre_maybe = description[pidx: description.rfind('.', pidx)]
	rec_maybe = description[ridx: description.rfind('.', ridx)]

	def parse(s):
		r = []
		words = s.split(' ')
		last_dep = None
		for i in xrange(len(words)):
			if words[i] in departments:
				try:
					maybe = words[i] + ' ' + words[i + 1]
				except IndexError:
					continue

				if maybe in courses:
					r.append(maybe)
					last_dep = words[i]
			elif last_dep and last_dep + ' ' + words[i] in courses:
				r.append(last_dep + ' ' + words[i])
	return parse(pre_maybe), parse(rec_maybe)



if __name__ == "__main__":
	parsed = []
	departments = set()
	courses = set()
	with open('old-banner.json', 'r') as f:
		s = json.load(f)
		for item in s:
			d = item['description']
			name = item['name']
			dep = name.split(' ')[0]
			if dep not in departments:
				departments.add(dep)
			courses.add(name)

			n = {
				'title': item['title'],
				'code': name,
				'description' : d,
				'prereqs': [],
				'recommended' : []
			}
			parsed.append(n)
		for item in parsed:
			(pre, rec) = find_prereqs(item['description'], departments, courses)
			item['prereqs'] = pre
			item['recommended'] = rec

	with open('parsed-json.json', 'w') as f:
                pprint.pprint(parsed, f)

