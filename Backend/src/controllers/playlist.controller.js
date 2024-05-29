import { asyncHandler } from "../utils/asyncHandler.js";
import { Playlist } from "../models/playlist.model.js";
import { Apierror } from "../utils/ApiError.js";
import { Apisuccess } from "../utils/Apisuccess.js";
import { isValidObjectId } from "mongoose";

export const createplaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user?._id
    });
    if (!playlist) {
        throw new Apierror(404, "Playlist couldn't be created");
    }
    return res.status(200).json(new Apisuccess(200, "Playlist created successfully", playlist));
});

export const updateplaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    if (!isValidObjectId(playlistId)) {
        throw new Apierror(400, "Invalid playlist id");
    }
    if (!description || description.length === 0) {
        throw new Apierror(400, "Description cannot be empty");
    }
    if (!name || name.length === 0) {
        throw new Apierror(400, "Playlist name cannot be empty");
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new Apierror(400, "Playlist not found");
    }
    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new Apierror(400, "Only the valid owner can change playlist");
    }
    const updated = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name,
                description
            }
        }, { new: true }
    );
    if (!updated) {
        throw new Apierror(500, "Playlist cannot be updated now. Try again later");
    }
    return res.status(200).json(new Apisuccess(200, "Playlist updated successfully", {}));
});

export const deleteplaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    if (!isValidObjectId(playlistId)) {
        throw new Apierror(400, "Invalid Playlist id");
    }
    const playlist = await Playlist.findById(playlistId);
    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new Apierror(400, "Only the valid owner can delete the playlist");
    }
    const deleted = await Playlist.findByIdAndDelete(playlistId);
    if (!deleted) {
        throw new Apierror(500, "Couldn't delete Playlist. Try again later");
    }
    return res.status(200).json(new Apisuccess(200, "Playlist deleted successfully", {}));
});

export const getuserplaylist = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!isValidObjectId(userId)) {
        throw new Apierror(400, "Invalid userId");
    }
    const playlists = await Playlist.find({
        owner: userId
    });
    if (!playlists || playlists.length === 0) {
        throw new Apierror(404, "No playlists found");
    }
    return res.status(200).json(new Apisuccess(200, "Playlists fetched successfully", playlists));
});

export const getplaylistbyid = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    if (!isValidObjectId(playlistId)) {
        throw new Apierror(400, "Invalid playlist id");
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new Apierror(404, "Couldn't find the playlist");
    }
    return res.status(200).json(new Apisuccess(200, "Playlist found", playlist));
});

export const removevideofromplaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    if (!isValidObjectId(playlistId)) {
        throw new Apierror(400, "Invalid playlist id");
    }
    if (!isValidObjectId(videoId)) {
        throw new Apierror(400, "Invalid video id");
    }
    const playlist = await Playlist.findById(playlistId);
    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new Apierror(404, "Only the valid user can delete video from playlist");
    }
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: {
                videos: videoId
            }
        }, { new: true }
    );
    if (!updatedPlaylist) {
        throw new Apierror(404, "Video couldn't be removed from the playlist");
    }
    return res.status(200).json(new Apisuccess(200, "Video removed from the playlist successfully", updatedPlaylist));
});
