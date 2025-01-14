import "./styles.css"
import SCI from "../../assets/SCI.svg";
import { useNavigate } from "react-router-dom";
import DocComponent from "../../components/DocComponent";
import {useEffect, useState} from "react";
import { Doc } from "../../entities/Doc";
import DocService from "../../services/DocService";
import { FetchAll } from "../../use_cases/docs/FetchAll";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import React from "react";

declare let window: any;

const fetchAll = new FetchAll(new DocService());

export default function HomePage() {

	const navigate = useNavigate();
	const [docList, setDocList] = useState<Doc[]>();
	const [filteredItems, setFilteredItems] = useState<Doc[]>();
	const [searchString, setSearchString] = useState<string>();
	const [view, setView] = React.useState('name');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchAll.execute(window).then((data) => {
			setDocList(data);
			setFilteredItems(data);
		});
		
		const user_id = sessionStorage.getItem("user_id")
		if (!user_id){
			console.log("Teste")
			navigate("/");
		}
	}, []);
	
	
	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFilteredItems(docList);
		if (!docList) return;

		const { target } = event
		const {value: text} = target

        setSearchString(text);

		if(view === 'name'){
			const filteredData = docList.filter((doc) => {
				const docName = doc.name.toLowerCase();
				const searchTextLower = text.toLowerCase();
				return docName.includes(searchTextLower) && doc.name !== '';
			})
			console.log(filteredData[0]);
			setFilteredItems(filteredData);
		}
		
		if(view === 'author'){
			const filteredData = docList.filter((doc) => {
				const docName = doc.author.toLowerCase();
				const searchTextLower = text.toLowerCase();
				return docName.includes(searchTextLower) && doc.author !== '';
			})
			setFilteredItems(filteredData);
		}
		
		if(view === 'year'){
			const filteredData = docList.filter((doc) => {	
				const docName = doc.year.toString().toLowerCase();
				const searchTextLower = text.toLowerCase();
				return docName.includes(searchTextLower) && doc.year !== 0;
			})
			setFilteredItems(filteredData);

            setTimeout(() => {
                setLoading(false); // Hide loading after filtering
                setFilteredItems(filteredData);
            }, 1500);
		}
	
	}

		

	const handleChange = (event: React.MouseEvent<HTMLElement>, nextView: string) => {
		setView(nextView);
	};
	

	return (
		<div className="container">
			<div className="top-bar">
				<img className="sci-logo" src={SCI} alt="SCI Logo"/>
				<h1>Welcome to Scientiary</h1>
				<div className="buttons">
					<button onClick={() => navigate("/mylib")} className="my-works-button" >My Works</button>
					<button onClick={() => navigate("/")} className="logout-button" >LogOut</button>
				</div>
			</div>
			<div className="body-screen">
				<div className="side-bar">
					<h1>Search Filter</h1>
					<div className="options">
						<ToggleButtonGroup
							orientation="vertical"
							value={view}
							exclusive={true}
							onChange={handleChange}
						>
							<ToggleButton value="name" aria-label="name">
								<p>Name</p>
							</ToggleButton>
							<ToggleButton value="author" aria-label="author">
								<p>Author</p>
							</ToggleButton>
							<ToggleButton value="year" aria-label="year">
								<p>Year</p>
							</ToggleButton>
							
						</ToggleButtonGroup>
					</div> 
				</div>
				<div className="sci-main">
					<div className="search">
						<input
							type="text"
							value={searchString}
							onChange={handleSearch}
							placeholder="Search"
							/>
						<div className="itens-field">
							{ filteredItems === undefined ?
								<p>Carregando...</p>:
								<div className="itens-list">
									{filteredItems?.map((doc, index) =>
										<DocComponent 
											data={doc}
											key={index}
											/>
										)	
									}
								</div>
							}
						</div>
					</div>
				</div>
			</div>

		</div>
	)
}
