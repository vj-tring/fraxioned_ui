import React, { useState } from 'react'
import '../DatesContainer/Card-item.css'

const CardItem = () => {
    const [adultsCount, setAdultsCount] = useState(1)
    const [childrenCount, setChildrenCount] = useState(0)
    const [infantsCount, setInfantsCount] = useState(0)
    const [petsCount, setPetsCount] = useState(0)
    const [showDropdown, setShowDropdown] = useState(false)

    const decreaseAdults = () => {
        if (adultsCount > 1) {
            setAdultsCount(adultsCount - 1)
        }
    }

    const increaseAdults = () => {
        setAdultsCount(adultsCount + 1)
    }

    const decreaseChildren = () => {
        if (childrenCount > 0) {
            setChildrenCount(childrenCount - 1)
        }
    }

    const increaseChildren = () => {
        setChildrenCount(childrenCount + 1)
    }

    const decreaseInfants = () => {
        if (infantsCount > 0) {
            setInfantsCount(infantsCount - 1)
        }
    }

    const increaseInfants = () => {
        setInfantsCount(infantsCount + 1)
    }

    const decreasePets = () => {
        if (petsCount > 0) {
            setPetsCount(petsCount - 1)
        }
    }

    const increasePets = () => {
        setPetsCount(petsCount + 1)
    }

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown)
    }

    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    return (
        <div className="card-item d-flex justify-content-around">
            <div className="whoGuest" onClick={toggleDropdown}>
                <span className="DateHead">Who</span>
                <p className="property">Add guests</p>
                {showDropdown && (
                    <div className="DropItems" onClick={stopPropagation}>
                        <div className="list-Items">
                            <span className="AD-count">
                                <span>Adults: </span>
                                <p className="list-Age">Age 13 or above</p>
                            </span>
                            <button
                                className="Dec-circle"
                                onClick={decreaseAdults}
                            >
                                -
                            </button>
                            <span className="Ad-count">{adultsCount}</span>
                            <button
                                className="Inc-circle"
                                onClick={increaseAdults}
                            >
                                +
                            </button>
                        </div>
                        <hr className="HLine"></hr>
                        <div className="list-Items">
                            <span className="AD-count">
                                <span>Children: </span>
                                <p className="list-Age">Age 2 to 12</p>
                            </span>
                            <button
                                className="Dec-circle"
                                onClick={decreaseChildren}
                            >
                                -
                            </button>
                            <span className="Ad-count">{childrenCount}</span>
                            <button
                                className="Inc-circle"
                                onClick={increaseChildren}
                            >
                                +
                            </button>
                        </div>
                        <hr className="HLine"></hr>
                        <div className="list-Items">
                            <span className="AD-count">
                                <span>Infants: </span>
                                <p className="list-Age">Under 2</p>
                            </span>
                            <button
                                className="Dec-circle"
                                onClick={decreaseInfants}
                            >
                                -
                            </button>
                            <span className="Ad-count">{infantsCount}</span>
                            <button
                                className="Inc-circle"
                                onClick={increaseInfants}
                            >
                                +
                            </button>
                        </div>
                        <hr className="HLine"></hr>
                        <div className="list-Items">
                            <span className="AD-count">
                                <span>Pets: </span>
                                <p className="list-Age">
                                    Bringing a service animal?
                                </p>
                            </span>
                            <button
                                className="Dec-circle"
                                onClick={decreasePets}
                            >
                                -
                            </button>
                            <span className="Ad-count">{petsCount}</span>
                            <button
                                className="Inc-circle"
                                onClick={increasePets}
                            >
                                +
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className="rightCircle">
                <div className="circle">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="30px"
                        viewBox="0 -960 960 960"
                        width="30px"
                        fill="#FFFFFF"
                    >
                        <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default CardItem
