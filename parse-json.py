import json
import pprint



def find_prereqs(description, departments, courses):
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
		words = s.split(' ')
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
	departments = set()
	courses = {}
	parsed = {}
	with open('banner.json', 'r') as f:
		s = json.load(f)
		i = 0
		for item in s:
			if item['name'].find('CSCI') == -1:
				continue

			try:
				d = str(item['description'])
			except UnicodeEncodeError:
				d = ""
				#print item['description']
			name = str(item['name'])
			dep = name.split(' ')[0]
			if dep not in departments:
				departments.add(dep)
			try:
				title = str(item['title'])
			except UnicodeEncodeError:
				title = name
			n = { 'data' : {
				'title': title,
				'code': name,
				'number': name.split(' ')[-1],
				'description' : d,
				'prereqs': [],
				'recommended' : [],
				'id' : str(i)
			}}
			i += 1
			courses[name] = n
			nodes.append(n)

		edges = []
		for item in nodes:
			item = item['data']
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
							'type' : t
						}
					}
					es.append(e)
				return es
			edges.extend(get_edges(pre, 'pre'))
			edges.extend(get_edges(rec, 'rec'))

		parsed = {
			'nodes' : nodes,
			'edges' : edges
		}




	with open('static/js/parsed-json.js', 'w') as f:

		s = json.dumps(parsed)
		f.write('window.elements = ' + s)

