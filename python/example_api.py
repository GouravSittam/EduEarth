# import requests
# import json

# url = "https://content.guardianapis.com/search?section=environment&from-date=2025-09-01&to-date=2025-09-01&show-fields=headline,trailText,bodyText&api-key="
# response = requests.get(url)
# data = json.loads(response.text)
# data_list = []


# results = data['response'].get('results', [])
# for article in results:
#     # handle missing fields
#     fields = article.get('fields', {}) 
    
#     data_dict = {
#         'id': article.get('id', 'unknown'),
#         'publish_date': article.get('webPublicationDate', ''),
#         'extracted_date': "",
#         'url': article.get('webUrl', ''),
#         'headline': fields.get('headline', 'No headline available'),
#         'body': fields.get('bodyText', 'No content available'),
#         'section': article.get('sectionName', 'environment'),
#         'source': 'guardian_api'
#     }
#     data_list.append(data_dict)

# print(len(data_list))