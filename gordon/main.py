#!/bin/python
import mechanize, getpass, json, urlparse
from bs4 import BeautifulSoup
from collections import OrderedDict

# Login to My.Gordon.edu with given credentials
# Returns browser instance
def loginMyGordon(username, password, browser):
    browser.open("https://my.gordon.edu/ics")
    browser.select_form(name="MAINFORM")
    browser['userName'] = username
    browser['password'] = password
    browser.submit()
    return browser

# Get meal points from My.Gordon.edu for given user
# Returns number of meal points
def getMealPoints(username, password, browser):
    browser = loginMyGordon(username, password, browser)

    studentsLink = browser.find_link(url="./Students/")
    browser.follow_link(studentsLink)

    mealpointsLink = browser.find_link(url="/ICS/Students/Mealpoints.jnz")
    browser.follow_link(mealpointsLink)

    soup = BeautifulSoup(browser.response().read())
    print soup.find('iframe')
    # INCOMPLETE

# Login to My.Gordon.edu with given credentials
# Returns browser instance
def loginGoGordon(username, password, browser):
    browser.add_password("https://go.gordon.edu", username, password)
    return browser

# Get chapel credit from Go.Gordon.edu with given credentials
# Returns dictionary with:
#   credit   (int)   User's credits
#   required (int)   Total required credits
def getChapelCredit(username, password, browser):
    browser = loginGoGordon(username, password, browser)
    browser.open("https://go.gordon.edu/student/chapelcredits/viewattendance.cfm")

    soup = BeautifulSoup(browser.response().read())

    creditTable = soup.find_all('table')[8]

    creditRow = creditTable.find_all('tr')[0]
    creditCell = creditRow.find_all('td')[1]

    reqRow = creditTable.find_all('tr')[1]
    reqCell = reqRow.find_all('td')[1]

    return {
        "credit": int(creditCell.text),
        "required": int(reqCell.text)
    }

# Get dining menu from Go.Gordon.edu with given credentials
# Returns dictionary with:
#   'DAY': (MON, TUE, WED, etc.)
#       'breakfast'    (string)    Breakfast menu
#       'lunch'        (string)    Lunch menu
#       'dinner'       (string)    Dinner menu
#   'DAY':
#       ... (see above)
def getDiningMenu(username, password, browser):
    browser = loginGoGordon(username, password, browser)
    browser.open("https://go.gordon.edu/departments/dining/menu.cfm")

    soup = BeautifulSoup(browser.response().read())

    tables = soup.find_all('table')
    nestedTables = tables[0].find_all('table')
    menuTable = nestedTables[5]
    days = menuTable.find_all('tr')[2:]

    menu = OrderedDict()

    for day in days:
        cells = day.find_all('td')
        cells = map(lambda cell:cell.text, cells)
        menu[cells[0]] = {}
        menu[cells[0]]['breakfast'] = cells[1]
        menu[cells[0]]['lunch'] = cells[2]
        menu[cells[0]]['dinner'] = cells[3]

    return menu

username = self.request.get("username")
password = self.request.get("password")

chapelCredit = getChapelCredit(username, password, mechanize.Browser())
diningMenu = getDiningMenu(username, password, mechanize.Browser())

print json.dumps({
    'chapelCredit': chapelCredit,
    'diningMenu': diningMenu
})
