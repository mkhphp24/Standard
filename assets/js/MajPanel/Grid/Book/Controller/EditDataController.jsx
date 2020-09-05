   /*
    * (c) MajPanel <https://github.com/MajPanel/>
    *
    * For the full copyright and license information, please view the LICENSE
    * file that was distributed with this source code.
    */

	import * as React from "react";
	import {useState} from "react";
	import { useForm } from "react-hook-form";
	import AlertSuccess from "../../../Alert/AlertSuccess";
	import AlertError from "../../../Alert/AlertError";
	import * as ConfigEditForm from '../Config/ConfigEditForm';
	import * as Config from "../Config/Config";
	import Divider from "@material-ui/core/Divider";

    /**
     * @author Majid Kazerooni <support@majpanel.com>
     */

	const EditDataController = (props) => {

		const { rowData } = props;
		const [alertSuccess, setAlertSuccess] = useState(false);
		const [alertError, setAlertError] = useState(false);
		const defaultValues = {
		  		    id : rowData.id,
				name : rowData.name,
				autor : rowData.autor,
				publisher : rowData.publisher,
				
		};

		const { register, handleSubmit, errors, setValue,watch, formState } = useForm({
			defaultValues
		});

		const alertClose = () => {
			setAlertSuccess(false);
			setAlertError(false);
		}

		const onSubmit = data => {
			const requestOptions = {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: data })
			};

			fetch(Config.PATH_EDIT_API, requestOptions)
			.then(result => result.json())
			.then((result) => {
				if( result.success === "Success" ) {
					setAlertSuccess(true);
					setTimeout(() => {
						setAlertSuccess(false);
					}, 2000);
				}
				else  {setAlertError(true);}
			});
		};



		//console.log(watch("example")); // you can watch individual input by pass the name of the input

		return (

			<div className="container" >
					<h1>Edit</h1>
    				<Divider/>
    				<div assName={'col-lg-12'} >
    					<AlertSuccess open={alertSuccess} handelClose={alertClose}/>
    					<AlertError open={alertError} handelClose={alertClose}/>
    				</div>
                    <form onSubmit={handleSubmit(onSubmit)} >

                        		
				<div className="form-group">
					<label >Name</label>
					<input type="text" className="form-control"
					       name="name"
					       placeholder="Enter Name" ref={register(ConfigEditForm.ValidateFields.name)} />
						{errors.name && <small className="form-text  text-danger" >{errors.name.message}</small>}
				</div>

				<div className="form-group">
					<label >Autor</label>
					<input type="text" className="form-control"
					       name="autor"
					       placeholder="Enter Autor" ref={register(ConfigEditForm.ValidateFields.autor)} />
						{errors.autor && <small className="form-text  text-danger" >{errors.autor.message}</small>}
				</div>

				<div className="form-group">
					<label >Publisher</label>
					<input type="text" className="form-control"
					       name="publisher"
					       placeholder="Enter Publisher" ref={register(ConfigEditForm.ValidateFields.publisher)} />
						{errors.publisher && <small className="form-text  text-danger" >{errors.publisher.message}</small>}
				</div>


                        <input name="id"  type="hidden"  ref={register(ConfigEditForm.ValidateFields.id)} />
                        <input type="submit" className={'btn btn-primary mb-2'} />
                        {/* <label>FormState:</label> */}
                        {/*<label>{JSON.stringify(formState)}</label>*/}
                    </form>

			</div>
		);
	}


	export default EditDataController;
