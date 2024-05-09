import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import RateReviewIcon from '@mui/icons-material/RateReview';
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import {
    Popover,
    Button,
    TextField,
    Rating,
    Backdrop,
    Grid,
    Box,
    Typography,
    IconButton,
} from '@mui/material';
import { addReview } from '../services/review/reviewAPIFetch.js'

export default function WriteReview({active, triggerFunction}) {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const courseId = queryParams.get('courseId');

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [BackdropOpen, setBackdropOpen] = React.useState(false);

    const popoverOpen = Boolean(anchorEl);
    const id = popoverOpen ? "simple-popover" : undefined;

    const [overall, setOverall] = React.useState(0);
    const [overallHover, setOverallHover] = React.useState(-1);

    const [difficulty, setDifficulty] = React.useState(0);
    const [difficultyHover, setDifficultyHover] = React.useState(-1);

    const [content, setContent] = React.useState(0);
    const [contentHover, setContentHover] = React.useState(-1);

    const [quality, setQuality] = React.useState(0);
    const [qualityHover, setQualityHover] = React.useState(-1);

    const [formData, setFormData] = useState({
        overall: '',
        difficulty: '',
        content: '',
        quality: '',
        review: '',
    });

    const calculateOverall = (formData) => {
        if (!formData.difficulty || !formData.content || !formData.quality) {
            return 0;
          }

        formData.overall = Math.round((formData.difficulty + formData.content + formData.quality) / 3);
    
        return formData.overall;
      };

    const handleClick = (event) => {
        setBackdropOpen(true);
        setDifficulty(0);
        setContent(0);
        setQuality(0);
        setFormData({
            overall: '',
            difficulty: '',
            content: '',
            quality: '',
            review: '',
        });
    };

    const handleClose = (event) => {
        setBackdropOpen(false);
        setDifficulty(0);
        setContent(0);
        setQuality(0);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await addReview(courseId, formData).then(()=>{
                triggerFunction()
            });
            console.log(res); // Log the response from the backend API
        } catch (error) {
            console.error('Error adding review:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value, // Update the value for the corresponding field
        }));
    };

    return (
        <div>
            <Button
                aria-describedby={id}
                disabled={!active}
                variant="contained"
                onClick={handleClick}
                sx={{ border: '2px solid grey', borderRadius: 4, color: '#000000' }}
            >
                Write a Review
                <RateReviewIcon color="icon" sx={{ height: '20px' }} />
            </Button>
            <Backdrop
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={BackdropOpen} // Changed BackdropOpen to open
                onClose={handleClose}
            >
                <Box sx={{ p: 2, bgcolor: 'white', mt: 1, width: '700px', borderRadius: 8, height: '320px' }} component="form"
                    onSubmit={handleSubmit}
                    noValidate>
                    <Grid container spacing={2} sx={{ ml: 2, }}>
                        <Grid item xs={10} sm={6}>
                            <Box sx={{
                                width: 250,
                                display: 'flex',
                                alignItems: 'center',
                            }}>
                                <Typography component="legend">Difficulty:</Typography>
                                <Rating
                                    size="small"
                                    name="hover-feedback"
                                    difficulty={difficulty}
                                    precision={1}
                                    getDifficultyLabelText={getDifficultyLabelText}
                                    onChange={(event, newDifficulty) => {
                                        setFormData(({ ...formData, difficulty: newDifficulty }));
                                        setDifficulty(newDifficulty);
                                    }}
                                    onChangeActive={(event, newDifficultyHover) => {
                                        setDifficultyHover(newDifficultyHover);
                                    }}
                                />
                                {difficulty !== null && difficulty !== 0 && (
                                    <Box sx={{ ml: 2 }}>{difficultylabels[difficultyHover !== -1 ? difficultyHover : difficulty]}</Box>
                                )}
                            </Box>
                        </Grid>
                        <Grid item xs={10} sm={6}>
                            <Box sx={{
                                width: 250,
                                display: 'flex',
                                alignItems: 'center',
                            }}>
                                <Typography component="legend">Content:</Typography>
                                <Rating
                                    size="small"
                                    name="hover-feedback"
                                    content={content}
                                    precision={1}
                                    getContentLabelText={getContentLabelText}
                                    onChange={(event, newContent) => {
                                        setFormData(({ ...formData, content: newContent }));
                                        setContent(newContent);
                                    }}
                                    onChangeActive={(event, newContentHover) => {
                                        setContentHover(newContentHover);
                                    }}
                                />
                                {content !== null && content !== 0 && (
                                    <Box sx={{ ml: 2 }}>{contentlabels[contentHover !== -1 ? contentHover : content]}</Box>
                                )}
                            </Box>
                        </Grid>
                        <Grid item xs={10} sm={6}>
                            <Box sx={{
                                width: 250,
                                display: 'flex',
                                alignItems: 'center',
                            }}>
                                <Typography component="legend">Quality:</Typography>
                                <Rating
                                    size="small"
                                    name="hover-feedback"
                                    quality={quality}
                                    precision={1}
                                    getQualityLabelText={getQualityLabelText}
                                    onChange={(event, newQuality) => {
                                        setFormData(({ ...formData, quality: newQuality }));
                                        setQuality(newQuality);
                                    }}
                                    onChangeActive={(event, newQualityHover) => {
                                        setQualityHover(newQualityHover);
                                    }}
                                />
                                {quality !== null && quality !== 0 && (
                                    <Box sx={{ ml: 2 }}>{qualitylabels[qualityHover !== -1 ? qualityHover : quality]}</Box>
                                )}
                            </Box>
                        </Grid>
                        <Grid item xs={10} sm={6}>
                            <Box sx={{
                                width: 250,
                                display: 'flex',
                                alignItems: 'center',
                            }}>
                                <Typography component="legend" >Overall:</Typography>
                                <Rating
                                    size="small"
                                    value={calculateOverall(formData)}
                                    precision={1}
                                    readOnly
                                    onChange={() => setOverall(calculateOverall(formData))}
                                />
                                <Box sx={{ ml: 2 }}>{overalllabels[calculateOverall(formData)]}</Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="outlined-multiline-static"
                                label="Write a Review"
                                multiline
                                rows={5}
                                sx={{ width: '600px' }}
                                name="review" // Set the name attribute to identify the field in the event
                                value={formData.review}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    mb: 3,
                                    borderRadius: 2,
                                    bgcolor: 'rgb(255,207,96)',
                                    color: '#808080',
                                    '&:hover': {
                                        bgcolor: 'rgb(255,199,71)',
                                        color: '#382e7f',
                                    },
                                }}
                                disabled={
                                    formData.overall == '' || formData.overall == 0 ||
                                    formData.review == ''
                                }
                                onClick={handleClose}
                            >
                                Done!
                            </Button>
                            <Tooltip title="Delete">
                                <IconButton sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <DeleteIcon onClick={handleClose}/>
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Box>
            </Backdrop>
        </div >
    );
}

function getDifficultyLabelText(difficulty) {
    return `${difficulty} Star${difficulty !== 1 ? 's' : ''}, ${difficultylabels[difficulty]}`;
}

const difficultylabels = {
    1: 'Challenging',
    2: 'Difficult',
    3: 'Moderate',
    4: 'Doable',
    5: 'Easy',
};

function getContentLabelText(content) {
    return `${content} Star${content !== 1 ? 's' : ''}, ${contentlabels[content]}`;
}

const contentlabels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Great',
    5: 'Excellent',
};

function getQualityLabelText(quality) {
    return `${quality} Star${quality !== 1 ? 's' : ''}, ${qualitylabels[quality]}`;
}

const qualitylabels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Great',
    5: 'Excellent',
};

function getOverallLabelText(overall) {
    return `${overall} Star${overall !== 1 ? 's' : ''}, ${overalllabels[overall]}`;
}

const overalllabels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Great',
    5: 'Excellent',
};

