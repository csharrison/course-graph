import json
import pprint

def find_prereqs(description, departments, courses):
	debug = False
	if description.count("Advanced programming") > 0:
		debug = True

	prereqs = 'Prerequisite'
	recommended = 'Recommended'
	pidx = description.rfind(prereqs)
	ridx = description.rfind(recommended)


	pre_maybe = None
	rec_maybe = None
	if pidx != -1:
		pre_maybe = description[pidx: description.rfind('.', pidx)]
	if ridx != -1:
		rec_maybe = description[ridx: description.rfind('.', ridx)]

	def parse(s):
		if s == None: return []

		r = []
		words = s.replace(',','').replace('.','').split(' ')
		last_dep = None
		i = 0
		while i  < len(words):
			if words[i] in departments:
				try:
					maybe = words[i] + ' ' + words[i + 1]

				except IndexError:
					i += 1
					continue

				if maybe in courses:
					r.append(maybe)
					last_dep = words[i]
					i +=1
			elif last_dep and last_dep + ' ' + words[i] in courses:
				r.append(last_dep + ' ' + words[i])
			i += 1
		return r
	return parse(pre_maybe), parse(rec_maybe)



if __name__ == "__main__":
	nodes = []
	departments = {}
	courses = {}
	parsed = {}
	with open('banner.json', 'r') as f:
		s = json.load(f)
		i = 0
		for item in s:
			d = (item['description'])
			name = (item['name'])
			dep = name.split(' ')[0]
			if dep not in departments:
				departments[dep] = {'nodes' : [], 'edges': []}

			title = (item['title'])
			n = { 'data' : {
				'title': title,
				'code': name,
				'dep' : dep,
				'number': name.split(' ')[-1],
				'description' : d,
				'prereqs': [],
				'recommended' : [],
				'id' : str(i)
			}}
			i += 1
			departments[dep]['nodes'].append(n)
			nodes.append(n)
			courses[name] = n

		for item in nodes:
			item = item['data']
			dep = item['dep']
			(pre, rec) = find_prereqs(item['description'], departments, courses)
			item['prereqs'] = pre
			item['recommended'] = rec
			def get_edges(name_lst, t):
				es = []
				for p in name_lst:
					course = courses[p]['data']
					e = {
						'data' : {
							'source': item['id'],
							'target' : course['id'],
							'id' : item['id']+'-'+course['id'],
							'type' : t,
							'source_code': item['code'],
							'target_code': course['code'],
							'outside': course['dep'] != item['dep']
						}
					}
					es.append(e)
				return es

			all_edges = get_edges(pre, 'pre')
			all_edges.extend(get_edges(rec, 'rec'))
			for e in all_edges:
				edge = e['data']
				if edge and departments[dep]['nodes'].count(courses[edge['target_code']]) == 0:
					departments[dep]['nodes'].append(courses[edge['target_code']])
			departments[dep]['edges'].extend(all_edges)

	with open('static/js/parsed-json.js', 'w') as f:
		s = json.dumps(departments, ensure_ascii=False, indent=4).encode('utf8')
		f.write('window.elements = ' + s)
