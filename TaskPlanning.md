##Task Planning & TDD - 4th November 2019 
#####UPDATE EC2 Instance - 10742
- Learn about EC2 
- Update it's instance from M3 to M4
---

#####Filter by location in the calendar and production view - 10725

- Add metainfo for ProductionCalendar and ProductionView - B - 1h 
- API for locations mapped to shots - B - ?
- Handle api based search for location for production calendar - B - ?  ProductionView - ?
- fetch locations mapped to shots and store it in redux - F - 2h 
- Add Filter Component in Production Calendar - F - 30m
- Add Filter Component in Production View - F - 30m
- Generalize Filter based on local & Api based - F - **?** 
- Read applied filters and send Api call to fetch the filtered data ProductionCalendar - F  
- Read applied filters and filter it locally ProductionView - F  
---

#####Prevent managed users from accessing the content request side panel from the content request list - 10723

---

#####Hyperlink the CRID number in the shot details drawer to the shot list page in ProductionBoard - 10675
- SidePanelHeaderView - http://localhost:3000/shots?q=840&shotId=415 -
```javascript  
const shotNumberLink = {
    title: shotData.shot_info.shot_number,
    link: StringHelper.format(
      'shots?q=##&shotId=##',
      shotData.content_request,
      shotData.id,
    ),
};
  
<AnchorTag
  className="heading"
  targetBlank
  message={getBrandRedirectionPath(shotData.brand)}
/>
```
---

#####Rearrange the position of products, props and talent section remove arrow key - 10758

- Styling task - 4h 
---
#####Update text tips for side drawer text fields in shot list so it's clearer to the brand manager what they need to type - 10671

- Styling task - 4h 
---
