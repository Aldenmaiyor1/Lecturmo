import * as React from "react";
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
    Container,
    InputAdornment,
    IconButton,
    OutlinedInput,
    InputLabel,
    FormControl,
    MenuItem,
    Select,
} from '@mui/material';

export default function WriteReview() {
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

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setBackdropOpen(true);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setBackdropOpen(false);
        setOverall(null);
        setDifficulty(null);
        setContent(null);
        setQuality(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const body = {
            username: username,
            password: password,
        };
        const res = await loginUser(JSON.stringify(body));
        if (res && res.error) {
            setError(res.message);
        } else {
            setError('');
            navigate('/');
        }
    };

    return (
        <div>
            <Button
                aria-describedby={id}
                variant="contained"
                onClick={handleClick}
                sx={{ border: '2px solid grey', borderRadius: 4, color: '#000000' }}
            >
                Write a Review
                <RateReviewIcon color="icon" sx={{ height: '20px' }} />
            </Button>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={BackdropOpen} // Changed BackdropOpen to open
            >
                <Popover
                    id={id}
                    open={popoverOpen} // Changed popoverOpen to open
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left"
                    }}
                    PaperProps={{
                        style: {
                            backgroundColor: "transparent",
                            boxShadow: "none",
                            borderRadius: 0
                        }
                    }}
                >
                    {/* <Box
                    sx={{
                        position: "relative",
                        mt: "10px",
                        "&::before": {
                            backgroundColor: "white",
                            content: '""',
                            display: "block",
                            position: "absolute",
                            width: 12,
                            height: 12,
                            top: -6,
                            transform: "rotate(45deg)",
                            left: "calc(50% - 6px)"
                        }
                    }}
                /> */}
                    <Box sx={{ p: 2, bgcolor: '#FFF3F3', mt: 1, width: '700px', borderRadius: 8 }} component="form"
                        onSubmit={handleSubmit}
                        noValidate>
                        <Grid container spacing={2} sx={{ ml: 2,}}>
                            <Grid item xs={10} sm={6}>
                                <Box sx={{
                                    width: 250,
                                    display: 'flex',
                                    alignItems: 'center',
                                }}>
                                    <Typography component="legend">Overall:</Typography>
                                    <Rating
                                        name="hover-feedback"
                                        overall={overall}
                                        precision={1}
                                        getOverallLabelText={getOverallLabelText}
                                        onChange={(event, newOverall) => {
                                            setOverall(newOverall);
                                        }}
                                        onChangeActive={(event, newOverallHover) => {
                                            setOverallHover(newOverallHover);
                                        }}
                                        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                    />
                                    {overall !== null && (
                                        <Box sx={{ ml: 2 }}>{overalllabels[overallHover !== -1 ? overallHover : overall]}</Box>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item xs={10} sm={6}>
                                <Box sx={{
                                    width: 250,
                                    display: 'flex',
                                    alignItems: 'center',
                                }}>
                                    <Typography component="legend">Difficulty:</Typography>
                                    <Rating
                                        name="hover-feedback"
                                        difficulty={difficulty}
                                        precision={1}
                                        getDifficultyLabelText={getDifficultyLabelText}
                                        onChange={(event, newDifficulty) => {
                                            setDifficulty(newDifficulty);
                                        }}
                                        onChangeActive={(event, newDifficultyHover) => {
                                            setDifficultyHover(newDifficultyHover);
                                        }}
                                        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                    />
                                    {difficulty !== null && (
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
                                        name="hover-feedback"
                                        content={content}
                                        precision={1}
                                        getContentLabelText={getContentLabelText}
                                        onChange={(event, newContent) => {
                                            setContent(newContent);
                                        }}
                                        onChangeActive={(event, newContentHover) => {
                                            setContentHover(newContentHover);
                                        }}
                                        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                    />
                                    {content !== null && (
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
                                        name="hover-feedback"
                                        quality={quality}
                                        precision={1}
                                        getQualityLabelText={getQualityLabelText}
                                        onChange={(event, newQuality) => {
                                            setQuality(newQuality);
                                        }}
                                        onChangeActive={(event, newQualityHover) => {
                                            setQualityHover(newQualityHover);
                                        }}
                                        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                    />
                                    {quality !== null && (
                                        <Box sx={{ ml: 2 }}>{qualitylabels[qualityHover !== -1 ? qualityHover : quality]}</Box>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="outlined-multiline-static"
                                    label="Write a Review"
                                    multiline
                                    rows={5}
                                    sx={{ width: '600px' }}
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
                                    onClick={handleClose}
                                >
                                    Done!
                                </Button>
                                <Tooltip title="Delete" >
                                    <IconButton sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={handleClose}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>


                    </Box>
                </Popover>
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