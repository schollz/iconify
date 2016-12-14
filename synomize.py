import json

from tqdm import tqdm
from pattern.en import pluralize, singularize,comparative, superlative,lexeme
from PyDictionary import PyDictionary
dictionary=PyDictionary()

def hasNumbers(inputString):
	return any(char.isdigit() for char in inputString)

emoji = ""
emojis = {}
pbar = tqdm(total=1500)
i = 0
with open("emojione-awesome.css","r") as f:
	for line in f:
		items = line.split()
		if len(items) < 2:
			continue
		if '.e1a-' in items[0]:
			emoji = items[0].split('.e1a-')[1]
		if 'background-image:' in line and "flag" not in emoji and "regional" not in emoji and len(emoji) >2:
			try:
				uid = line.split('svg')[1][1:-1]
				if "-" in uid or hasNumbers(emoji):
					continue
				# print(emoji,uid)
				emojis[emoji] = {"category":"oneemoji","char":uid}
				searchWord = emoji
				if "_" in searchWord:
					searchWord = searchWord.split("_")[0]
				possibleWords = [] + dictionary.synonym(singularize(searchWord)) + dictionary.synonym(pluralize(searchWord))
				goodWords = set()
				for word in possibleWords:
					goodWords.add(singularize(word))
					goodWords.add(pluralize(word))
					goodWords.add(comparative(word))
					goodWords.add(superlative(word))
					goodWords = goodWords | set(lexeme(word))
				actualGoodWords = []
				for word in goodWords:
					if " " not in word:
						actualGoodWords.append(word)
				emojis[emoji]["keywords"] = actualGoodWords
			except:
				pass
			pbar.update(1)
			i = i + 1
			if i > 10000000:
				break
pbar.close()

with open("emojis3.json","w") as f:
	f.write(json.dumps(emojis,indent=2))

# originalJSON = json.load(open("emojis.json","r"))
# newJSON = {}
# keys = list(originalJSON.keys())
# for i in tqdm(range(len(keys))):
# 	key = keys[i]
# 	newJSON[key] = originalJSON[key].copy()
# 	try:
# 		newJSON[key]["keywords"] += dictionary.synonym(key)
# 	except:
# 		pass

# with open("emojis2.json","w") as f:
# 	f.write(json.dumps(newJSON,indent=2))

# print(newJSON["hugging"])