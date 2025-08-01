import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import KText from '../../../KText'
import KIcon from '../../../KIcon/KIcon'
import KButton from '../../../KButton/KButton'
import variables from '../../../../styles/variables'
import ListAvailbleDates from './ListAvailbleDates'
import KSideModal from '../../../KModal/KSideModal'
import KCalendar from '../../../KCalendar'
import SelectDates from './SelectDates'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import { avilebleDatesAtom } from '../../../../atoms'
import useIsMobile from '../../../../hooks/useIsMobile'


type ValuePiece = Date | null

type Value = ValuePiece | [ValuePiece, ValuePiece]

const CalendarComponent = () => {

  const [availableDates, setAvailableDates] = useAtom(avilebleDatesAtom)
  const [isOpenCalendar, setIsOpenCalendar] = useState(false)
  const [value, onChange] = useState<Value>([
    new Date(),
    new Date()
  ])

  const [calendarSelectedDateRange, setCalendarSelectedDateRange] = useState<Value>([new Date(),new Date()])

  const handleClickAddSlots = () => {
    setAvailableDates([{ id: availableDates.length + 1, value }, ...availableDates])
    adjustRangeIfBlocked(value as [Date, Date])
    setIsOpenCalendar(false)
    setCalendarSelectedDateRange([
      new Date(),
      new Date()
    ])
  }

  const isDateInRanges = (date: Date) => {
    return availableDates.some((item: any) => {
      if (!Array.isArray(item.value) || item.value.length < 2) return false
      const start = new Date(item.value[0])
      const end = new Date(item.value[1])
      const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const s = new Date(start.getFullYear(), start.getMonth(), start.getDate())
      const e = new Date(end.getFullYear(), end.getMonth(), end.getDate())
      return d >= s && d <= e
    })
  }

  const adjustRangeIfBlocked = (range: [Date, Date]) => {
    for (const item of availableDates) {
      if (!Array.isArray(item.value) || item.value.length < 2) continue
      const blockedStart = new Date(item.value[0])
      const blockedEnd = new Date(item.value[1])
      // Якщо діапазони перетинаються
      if (
        range[0] <= blockedEnd &&
        range[1] >= blockedStart
      ) {
        const newStart = dayjs(blockedEnd).add(1, 'day').toDate()
        const newEnd = dayjs(newStart).add(6, 'day').toDate()
        onChange([newStart, newEnd])
        return true
      }
    }
    return false
  }

  const handleChange = (val: Value) => {
    if (Array.isArray(val) && val[0] && val[1]) {
      if (adjustRangeIfBlocked([val[0], val[1]])) {
        return
      }
    }
    onChange(val)
    setCalendarSelectedDateRange(val)
  }

  const [itemEdit, setItemEdit] = useState<any>(undefined)
  const handleClickEdit = (item: any) => {
    // console.log('availableDates', availableDates, item)
    setIsOpenCalendar(true)
    let updateItems = availableDates.filter((i: any) =>
      i.id !== item.id
    )

    setAvailableDates(updateItems)
    onChange(item.value)
    setCalendarSelectedDateRange(item.value)
    setIsOpenCalendar(true)
    setItemEdit(item)
  }
  const { isMobile } = useIsMobile()
  useEffect(() => {
    if (Array.isArray(value) && value[0] && value[1]) {
      adjustRangeIfBlocked([value[0], value[1]])
    }
  }, [availableDates])

  useEffect(() => {
    if(!isOpenCalendar){
      setCalendarSelectedDateRange([
        new Date(),
        new Date()
      ])
    }
  }, [isOpenCalendar])
  return (
    <>
      <View style={[styles.container, { justifyContent: 'center', marginBottom: isMobile ? 25 : 70, width: '100%' }]}>
        <Pressable onPress={() => availableDates.length ? {} : setIsOpenCalendar(true)} style={{ width: '100%' }}>
          <SelectDates
            startDate={availableDates[0]?.value?.[0] ?? new Date()}
            endDate={availableDates[0]?.value?.[1] ?? new Date()}
          />
        </Pressable >

        {availableDates && availableDates?.length > 0 && availableDates?.length < 3 &&
          <KButton onPress={() => setIsOpenCalendar(true)} color='light' style={styles.button} >
            <KIcon name="plusCircle" size="medium" style={{ stroke: '#000', opacity: 0.5 }} />
            <KText style={{ color: "#000", fontSize: 15, marginLeft: 10 }}>
              Add more slots
            </KText>
          </KButton>}

      </View >
      <ListAvailbleDates items={availableDates} setItems={setAvailableDates} onPressEdit={handleClickEdit} />
      <KSideModal
        visible={isOpenCalendar}
        onClose={() => {
          setIsOpenCalendar(false)
          Boolean(itemEdit) && setAvailableDates([...availableDates, itemEdit])
        }}
        showCross={!isMobile}
        position={isMobile ? 'bottom' : 'right'}
        style={isMobile ? {
          height: 'auto',
          position: 'absolute',
          bottom: 0,
          width: '100%',
          
          paddingTop: 23,
          paddingBottom: 50,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          
        } : {
          // maxWidth: 500,
          // left: '81%'
        }}
      >
        <View style={[styles.container, styles.calendarContainer]}>
          <SelectDates
            style={{ marginBottom: 46, }}
            startDate={Array.isArray(calendarSelectedDateRange) ? calendarSelectedDateRange[0] : new Date()}
            endDate={Array.isArray(calendarSelectedDateRange) ? calendarSelectedDateRange[1] : new Date()}
          />
          <KCalendar
            onChange={handleChange}
            value={calendarSelectedDateRange}
            minDate={new Date()}
            tileDisabled={({ date, view }) =>
              view === 'month' && isDateInRanges(date)
            }
            />
           
          <View style={styles.containerButtons}>
            <KButton
              text='Cancel'
              onPress={() => {
                setIsOpenCalendar(false)
                Boolean(itemEdit) && setAvailableDates([...availableDates, itemEdit])
              }}
              color='light'
              style={{ width: '100%', flex: 1 }}
            />
            <KButton
              text='Confirm'
              onPress={() => handleClickAddSlots()}
              color='primary'
              style={{ width: '100%', flex: 1 }}
            />
          </View>
        </View>
      </KSideModal>
    </>
  )
}

export default CalendarComponent

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  
  },
  label: {
    color: "#000",
    fontSize: 15,
    opacity: 0.5,
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 30,
    height: 50,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: variables.colors.lightCream,
    display: 'flex',
    flexDirection: 'row',
    width: 'auto',
    marginTop: 10,
    borderWidth: 0,
    paddingHorizontal: 40,
    paddingVertical: 8,
  },
  calendarContainer: {
    alignItems: 'center',
    paddingHorizontal: 50,
    height: '100%',
    
  },
  containerButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 80,
    columnGap: 23
  }
})