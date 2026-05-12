import DatePickerRange from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { ISearchBy, ISearchByOpts } from '../interfaces/search'

interface IDatePickerProps {
    activeModule?: string | null
    searchBy: ISearchBy
    onSetSearchBy: (searchBy: ISearchByOpts) => void
    onChangeModule: (moduleName: string | null) => void
    numOfMonths?: number
}

export function DatePicker({
    searchBy,
    onSetSearchBy,
    activeModule = 'startDate',
    onChangeModule,
    numOfMonths = 2,
}: IDatePickerProps) {
    //
    const handleDatesChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates
        onSetSearchBy({ startDate: start || undefined, endDate: end || undefined })

        if (!start) {
            onChangeModule('startDate')
        } else if (!end) {
            onChangeModule('endDate')
        } else {
            onChangeModule(null)
        }
    }

    return (
        <section className='datepicker'>
            <DatePickerRange
                selectsRange
                startDate={searchBy.startDate ? new Date(searchBy.startDate) : undefined}
                endDate={searchBy.endDate ? new Date(searchBy.endDate) : undefined}
                onChange={handleDatesChange}
                monthsShown={numOfMonths}
                minDate={new Date()}
                inline
            />
        </section>
    )
}
