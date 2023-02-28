import './style.scss';
import React, { useState, useEffect } from 'react'
import useAxios from '../../app/hooks/useAxios';
import { BASE_API_URI } from '../../utils/constants';
import { useToast, Spinner } from '@chakra-ui/react';
import Footer from '../../components/Footer';
import TopNav from '../../components/TopNav';
import SelectInput from '../../components/SelectInput';
import PasswordInput from '../../components/PasswordInput';
import PageMeta from '../../components/PageMeta';


function ProfileScreen() {
    const { trigger: getUserProfile, data: responseData, error, isLoading } = useAxios({ mainUrl: `${BASE_API_URI}/auth/profile/` });
    const { trigger: updateUserProfile, data: updateResponse, error: updateError, isLoading: isUpdatingUser } = useAxios({ method: "POST" });

    const [hidePassowordUpdate, setHidePassowordUpdate] = useState(true);
    const toast = useToast()
    const [currentUser, setCurrentUser] = useState(null)

    // Form input
    const [surname, setSurname] = useState('');
    const [otherNames, setOtherNames] = useState('');
    const [phone, setPhone] = useState('');
    const [phoneNetwork, setPhoneNetwork] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [locale, setLocale] = useState('');
    const [assignedImageBatch, setAssignedImageBatch] = useState('');
    const [assignedAudioBatch, setAssignedAudioBatch] = useState('');


    const handleFormSubmit = async (e) => {
        if (!(surname && otherNames, phone, phoneNetwork, emailAddress, locale)) {
            alert("Choose complete all fields.")
        }

        e.preventDefault()
        const body = {
            surname,
            other_names: otherNames,
            phone,
            phone_network: phoneNetwork,
            email_address: emailAddress,
            locale: locale,
            assigned_image_batch: assignedImageBatch,
            assigned_audio_batch: assignedAudioBatch,
            password: password
        }

        updateUserProfile(
            `${BASE_API_URI}/auth/profile/`,
            body
        )
    }

    // If response data changes
    useEffect(() => {
        if (Boolean(responseData?.user)) {
            setCurrentUser(responseData.user)
        }
    }, [responseData, isLoading])

    // Get profile on mount
    useEffect(() => {
        getUserProfile()
    }, [])

    // Popoluate form
    useEffect(() => {
        if (Boolean(currentUser)) {
            setSurname(currentUser.surname || "")
            setOtherNames(currentUser.other_names || "")
            setPhone(currentUser.phone || "")
            setPhoneNetwork(currentUser.phone_network || "")
            setEmailAddress(currentUser.email_address || "")
            setLocale(currentUser.locale || "")
            setAssignedImageBatch(currentUser.assigned_image_batch || "")
            setAssignedAudioBatch(currentUser.assigned_audio_batch || "")
        }
    }, [currentUser])

    // Update error
    useEffect(() => {
        if (Boolean(updateError) && !isUpdatingUser) {
            toast.close("update")
            toast({
                id: "update",
                position: 'top-center',
                title: `An error occurred`,
                description: updateError,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [updateError, isUpdatingUser])

    // Success alert
    useEffect(() => {
        if (Boolean(updateResponse) && Boolean(updateResponse?.user) && !isUpdatingUser) {
            toast.close("update")
            toast({
                id: "update",
                position: 'top-center',
                title: `Success`,
                description: "Profile updated successfully.",
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [updateResponse, isUpdatingUser])

    return (
        <div className="profile-page">
            <TopNav />
            <PageMeta title="Profile | Speech Data UG" />

            <div className="p-2">
                <div className="mx-auto d-flex flex-wrap col-lg-8 my-3">
                    <h4>PROFILE</h4>
                </div>
                <div className="mx-auto col-lg-4 col-md-6 mx-auto">
                    <form onSubmit={handleFormSubmit}>
                        <h1><b>BIO</b></h1>
                        <div className="mb-3">
                            <label htmlFor="surname" className="form-label">Surname</label>
                            <input type="text" className="form-control" id="surname" aria-describedby="surname"
                                onChange={(e) => setSurname(e.target.value)}
                                placeholder="Enter surname"
                                required
                                value={surname} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="other-names" className="form-label">Other Names</label>
                            <input type="text" className="form-control" id="other-names" aria-describedby="other-names"
                                onChange={(e) => setOtherNames(e.target.value)}
                                placeholder="Enter other names"
                                required
                                value={otherNames} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Momo Number</label>
                            <input type="text" className="form-control" id="phone" aria-describedby="phone"
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Enter momo number"
                                required
                                value={phone} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="phone_network" className="form-label">Phone Network</label>
                            <SelectInput
                                onChange={(e) => setPhoneNetwork(e.target.value)}
                                required={true}
                                value={phoneNetwork}
                                options={[
                                    { value: "", label: 'Choose network' },
                                    { value: 'MTN', label: 'MTN' },
                                    { value: 'VODAFONE', label: 'VODAFONE' },
                                    { value: 'AIRTELTIGO', label: 'AIRTELTIGO' },
                                ]}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email_address" className="form-label">Email Address</label>
                            <input type="email" className="form-control" id="email_address" aria-describedby="email_address"
                                onChange={(e) => setEmailAddress(e.target.value)}
                                placeholder="Enter email address"
                                required
                                value={emailAddress} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="locale" className="form-label">Locale</label>
                            <SelectInput
                                onChange={(e) => setLocale(e.target.value)}
                                value={locale}
                                required
                                options={[
                                    { value: '', label: 'Choose locale' },
                                    { value: 'dag_gh', label: 'Dagbani' },
                                    { value: 'dga_gh', label: 'Dagaare' },
                                    { value: 'ee_gh', label: 'Ewe' },
                                    { value: 'kpo_gh', label: 'Ikposo' },
                                    { value: 'ak_gh', label: 'Akan' },
                                ]}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="assigned_image_batch" className="form-label">Assigned Image Batch</label>
                            <p>{assignedImageBatch}</p>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="assigned_audio_batch" className="form-label">Assigned Audio Batch</label>
                            <p>{assignedAudioBatch}</p>
                        </div>

                        <div className="my-5">
                            <div className="d-flex justify-content-between">
                                <h1><b>PASSWORD</b></h1>
                                <button className="btn btn-light"
                                    type='button'
                                    onClick={() => {
                                        setPassword("")
                                        setHidePassowordUpdate(!hidePassowordUpdate)
                                    }}>
                                    {hidePassowordUpdate && "Change Password"}
                                    {!hidePassowordUpdate && "hide"}
                                </button>
                            </div>
                            {!hidePassowordUpdate &&
                                <div>
                                    {currentUser && <p className="text-muted">Enter your new password</p>}
                                    <PasswordInput placeholder="New password" value={password} setValue={setPassword} required={currentUser == null} />
                                </div>
                            }
                        </div>

                        <div className="mb-3">
                            <p className="text-end">
                                <button
                                    className='btn btn-sm btn-primary d-flex align-items-center'
                                    disabled={isUpdatingUser || (assignedAudioBatch === assignedImageBatch)}>
                                    {isUpdatingUser && <Spinner />}
                                    Submit
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ProfileScreen;
