import React from 'react'
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './Footer.css'

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="row">
                <div className="col-md-3">
                    <div className="logo"></div>
                </div>
                <div className="col-md-2">
                    <ul>
                        <li>
                            <Link to="/dashboard" className="no-underline">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/booking"
                                className="no-underline disabled"
                            >
                                Booking
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/peak-season"
                                className="no-underline disabled"
                            >
                                Peak Season
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="col-md-2">
                    <ul>
                        <li>
                            <Link
                                to="/payments"
                                className="no-underline disabled"
                            >
                                Payments
                            </Link>
                        </li>
                        <li>
                            <Link to="/faq" className="no-underline">
                                FAQ
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/account"
                                className="no-underline disabled"
                            >
                                Account
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="col-md-2">
                    <ul>
                        <li>
                            <Link
                                to="/documents"
                                className="no-underline disabled"
                            >
                                Documents
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className="no-underline">
                                Contact
                            </Link>
                        </li>
                        <li>
                            <a
                                href="https://www.fraxioned.com/"
                                className="no-underline"
                            >
                                fraxioned.com
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    )
}

export default Footer
